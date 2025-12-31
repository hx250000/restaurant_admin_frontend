<template>
    <el-container class="layout-container">
        <el-header class="header">
            餐厅后台管理
            <el-button style="float:right;margin-top:10px" type="danger" @click="logout">
                退出登录
            </el-button>
        </el-header>

        <el-container>
            <!-- 左侧菜单 -->
            <el-aside width="200px" class="sidemenu">
                <el-menu :default-openeds="['1']">
                    <el-submenu index="1">
                        <template slot="title">
                            <h3>管理选项</h3>
                        </template>
                        <el-menu-item index="1-1">
                            <router-link to="/user">用户管理</router-link>
                        </el-menu-item>
                        <el-menu-item index="1-2">
                            <router-link to="/dish">菜品管理</router-link>
                        </el-menu-item>
                        <el-menu-item index="1-3" class="curpage">
                            <router-link to="/order">订单管理</router-link>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 主内容 -->
            <el-main>
                <!-- 搜索 -->
                <el-form inline>
                    <el-form-item label="订单号">
                        <el-input v-model="searchOrderNo" placeholder="请输入订单号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchByOrderNo">查询</el-button>
                        <el-button @click="loadAll">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-radio-group v-model="currentStatus" @change="loadByStatus" style="margin-bottom: 16px;">
                    <el-radio-button label="CREATED">未完成订单</el-radio-button>
                    <el-radio-button label="FINISHED">已完成订单</el-radio-button>
                </el-radio-group>
                <div></div>
                <div></div>

                <el-table :data="pagedOrders" style="margin-bottom: 16px;">
                    <el-table-column label="订单号" prop="orderNo" />
                    <el-table-column label="用户ID" prop="userId" />
                    <el-table-column label="总金额" prop="totalAmount" />
                    <el-table-column label="状态" prop="status" />
                    <el-table-column label="创建时间" prop="createTime" />
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>

                            <!-- 只有未完成订单才显示“完成订单” -->
                            <el-button v-if="currentStatus === 'CREATED'" size="mini" type="success"
                                @click="finishOrder(scope.row)">
                                完成订单
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="prev, pager, next, total" :current-page="currentPage"
                    :page-size="pageSize" :total="total" @current-change="handlePageChange" />

                <!-- 订单详情弹窗 -->
                <el-dialog title="订单详情" :visible.sync="detailVisible" width="600px">
                    <el-descriptions border column="2">
                        <el-descriptions-item label="订单号">{{ orderDetail.orderNo }}</el-descriptions-item>
                        <el-descriptions-item label="用户ID">{{ orderDetail.userId }}</el-descriptions-item>
                        <el-descriptions-item label="总金额">{{ orderDetail.totalAmount }}</el-descriptions-item>
                        <el-descriptions-item label="状态">{{ orderDetail.status }}</el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ orderDetail.createTime }}</el-descriptions-item>
                    </el-descriptions>

                    <br />
                    <el-table :data="orderDetail.items" border>
                        <el-table-column label="菜品名" prop="dishName" />
                        <el-table-column label="单价" prop="price" />
                        <el-table-column label="数量" prop="quantity" />
                        <el-table-column label="小计" prop="subtotal" />
                    </el-table>

                    <span slot="footer">
                        <el-button @click="detailVisible = false">关闭</el-button>
                    </span>
                </el-dialog>

            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import request from "@/utils/request";

export default {
    data() {
        return {
            currentStatus: 'CREATED',
            pageSize: 6,
            currentPage: 1,
            total: 0,
            orders: [],
            pagedOrders: [],
            searchOrderNo: "",
            detailVisible: false,
            orderDetail: {
                items: []
            }
        };
    },
    methods: {
        loadByStatus() {
            request
                .get(`/api/orders/admin/status/${this.currentStatus}`)
                .then(res => {
                    this.orders = res.data.data;
                    this.orders = res.data.data || [];
                    this.currentPage = 1; // 切换状态时回到第一页
                    this.handlePageData();
                });
        },
        logout() {
            localStorage.removeItem("jwt_token");
            this.$router.push("/login");
        },

        loadAll() {
            this.currentStatus = "CREATED";
            this.loadByStatus();
            // request.get("/api/orders/admin/list").then(res => {
            //     this.orders = res.data.data;
            //     this.splitOrders();
            // });
        },

        handlePageData() {
            this.total = this.orders.length;

            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;

            this.pagedOrders = this.orders.slice(start, end);
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.handlePageData();
        },


        searchByOrderNo() {
            if (!this.searchOrderNo) {
                this.loadAll();
                return;
            }
            request
                .get(`/api/orders/orderno/${this.searchOrderNo}`)
                .then(res => {
                    this.orderDetail = res.data.data;
                    this.detailVisible = true;
                });
        },

        viewDetail(row) {
            request
                .get(`/api/orders/orderno/${row.orderNo}`)
                .then(res => {
                    this.orderDetail = res.data.data;
                    this.detailVisible = true;
                });
        },

        finishOrder(row) {
            this.$confirm("确认完成该订单？", "提示", { type: "warning" })
                .then(() => {
                    request.put(`/api/orders/admin/${row.id}/finish`).then(() => {
                        this.$message.success("订单已完成");
                        this.loadByStatus();
                    });
                });
        }
    },
    mounted() {
        // this.loadAll();
        this.loadByStatus();
    }
};
</script>

<style>
:root {
    --primary: #ff7e5f;
    --primary-dark: #eb5e41;
    --primary-light: #ffb199;
    --secondary: #0ba360;
    --text-dark: #333333;
    --text-light: #f8f9fa;
    --background: rgb(229, 237, 251);
    --background-light: #f8f9fa;
    --card-bg: #ffffff;
    --border-radius: 8px;
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
    --title: rgb(238, 241, 246);
}

.header {
    font-size: 40px;
    background-color: var(--background);
    color: var(--text-dark);
    text-align: left;
}

.sidemenu {
    background-color: var(--background)
}

html,
body,
#app {
    height: 100%;
    margin: 0;
}

.layout-container {
    height: 100vh;
    /* 撑满整个视口 */
}

.el-menu-item a {
    color: inherit;
    text-decoration: none;
    display: block;
    /* 让点击区域覆盖整个菜单项 */
}

/* 可直接复用你原来的样式 */
</style>

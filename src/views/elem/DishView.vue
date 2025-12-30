<template>
  <el-container class="layout-container">
    <!--<el-header>Header</el-header>-->
    <!-- <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)"> -->
    <el-header class="header">
      餐厅后台管理
      <el-button style="float: right; margin-top: 10px;" type="danger" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px" class="sidemenu">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title">
              <h3>管理选项</h3>
            </template>
            <el-menu-item-group>
              <!--<template slot="title">分组一</template>-->
              <el-menu-item index="1-1">
                <router-link to="/user">用户管理</router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link to="/dish">菜品管理</router-link>
              </el-menu-item>
              <el-menu-item index="1-3">
                <router-link to="/order">订单管理</router-link>
              </el-menu-item>
            </el-menu-item-group>

          </el-submenu>

        </el-menu>
      </el-aside>

      <el-main>
        <!--顶部查询表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="菜品查询">
            <el-input v-model="formInline.keyword" placeholder="请输入菜品关键词"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="success" @click="onAddNewDish">添加菜品</el-button>
          </el-form-item>
        </el-form>
        <!--中间的table-->
        <el-table :data="tableData" style="width: 100%">

          <el-table-column label="菜品名称">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.dishname }}</span>
            </template>
          </el-table-column>

          <el-table-column label="菜品描述">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column label="菜品分类">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.category }}</span>
            </template>
          </el-table-column>

          <el-table-column label="价格">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.price }}</span>
            </template>
          </el-table-column>

          <el-table-column label="辣度">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.spicy ? '辣' : '不辣' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="库存">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.stock }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="260px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="warning" @click="handleAddStock(scope.row)">增加库存</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <!--分页-->
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
          :current_page="currentPage" @current-change="handlePageChange">
        </el-pagination>
        <!--弹出添加菜品对话框-->
        <el-dialog title="添加新菜品" :visible.sync="dialogFormVisible" width="500px">
          <el-form :model="form">
            <el-form-item label="菜品名称" :label-width="formLabelWidth">
              <el-input v-model="form.dishname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品描述" :label-width="formLabelWidth">
              <el-input v-model="form.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品价格" :label-width="formLabelWidth">
              <el-input v-model="form.price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" :label-width="formLabelWidth">
              <el-input v-model="form.stock" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品分类" :label-width="formLabelWidth">
              <el-input v-model="form.category" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品辣度" :label-width="formLabelWidth">
              <el-checkbox v-model="form.spicy" autocomplete="off">辣</el-checkbox>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitNewDish">确 定</el-button>
          </div>
        </el-dialog>
        <!--弹出修改题目对话框-->
        <el-dialog title="编辑菜品" :visible.sync="isEdit" width="500px">
          <el-form :model="formUpdate">
            <el-form-item label="菜品名称" :label-width="formLabelWidth">
              <el-input v-model="formUpdate.dishname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品描述" :label-width="formLabelWidth">
              <el-input v-model="formUpdate.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品价格" :label-width="formLabelWidth">
              <el-input v-model="formUpdate.price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" :label-width="formLabelWidth">
              <el-input v-model="formUpdate.stock" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品分类" :label-width="formLabelWidth">
              <el-input v-model="formUpdate.category" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品辣度" :label-width="formLabelWidth">
              <el-checkbox v-model="formUpdate.spicy" autocomplete="off">辣</el-checkbox>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="isEdit = false">取 消</el-button>
            <el-button type="primary" @click="onUpdateDish">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//import axios from 'axios';
//import { is } from 'core-js/core/object';
import request from "@/utils/request";

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogResetVisible: false,
      isEdit: false,
      formLabelWidth: "100px",
      currentPage: 1,
      pageSize: 6, // 每页显示的条数
      total: 0,    // 总条数
      allData: [],
      tableData: [],

      form: {
        dishname: '',
        description: '',
        price: 0.0,
        stock: 0,
        category: '',
        spicy: false
      },
      formUpdate: {
        id: '',
        dishname: '',
        description: '',
        price: 0.0,
        stock: 0,
        category: '',
        spicy: false
      },
      formInline: {
        keyword: ''
      }
    }
  },
  methods: {
    handleAddStock(row) {
      this.$prompt('请输入增加的库存数量', '增加库存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]+$/,
        inputErrorMessage: '请输入正整数'
      }).then(({ value }) => {
        const addStock = parseInt(value);
        request
          .put(`/api/dishes/${row.id}/stock/add`, null, { params: { addStock } })
          .then((response) => {
            console.log(response);
            this.$message({
              type: 'success',
              message: '库存增加成功!'
            });
            // 更新本地表格显示
            this.getAll();
            this.handlePageChange(this.currentPage);
          })
          .catch((error) => {
            console.error('Error adding stock:', error);
            let msg = '库存增加失败，请稍后重试!';
            if (error.response && error.response.data) {
              msg = error.response.data.message || msg;
            }
            this.$message.error(msg);
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },

    onAddNewDish() {
      this.dialogFormVisible = true;
    },

    onSubmit() {
      console.log('submit!');
    },
    onSearch() {
      // 这里可以添加查询逻辑
      const keyword = this.formInline.keyword;
      console.log("Searching for:", keyword);
      // 例如，调用API获取数据
      if (!keyword) {
        // 如果关键字为空，加载第一页数据
        this.getAll();
        return;
      }
      //axios
      request
        .get(`/api/dishes/search?keyword=${this.formInline.keyword}`)
        .then((response) => {
          //this.tableData = response.data.data;
          this.allData = response.data.data;
          this.total = this.allData.length;

          // 加载第一页
          this.currentPage = 1;
          this.updateTableData();
          console.log("Search results:", response.data);
          // this.total = response.data.data.total;
        })
        .catch((error) => {
          console.error("Error searching dishes:", error);
        });
    },
    logout() {
      // 删除 token
      localStorage.removeItem('jwt_token');
      // 跳转到登录页面
      this.$router.push('/login');
      this.$message({
        type: 'success',
        message: '已退出登录',
      });
    },
    handleEdit(index, row) {
      this.isEdit = true;
      this.formUpdate = {
        id: row.id,
        dishname: row.dishname,
        description: row.description,
        price: row.price,
        stock: row.stock,
        category: row.category,
        spicy: false
      };
    },
    handleDelete(index, row) {
      console.log(index, row);
      const id = row.id; // 获取当前条目的 id
      this.$confirm("此操作将删除该菜品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用删除接口（GET 请求）
          //axios
          request
            .delete(`/api/dishes?id=${id}`) // 使用 GET 请求传递 id 参数
            .then((response) => {
              console.log(response.data);
              // 删除成功后刷新当前页数据
              this.getAll();
              this.handlePageChange(this.currentPage);
            })
            .catch((error) => {
              console.error("Error deleting dish:", error);

              let msg = "菜品删除失败，请稍后重试!";
              if (error.response && error.response.data) {
                msg = error.response.data.message || msg;
              }

              this.$message.error(msg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.updateTableData();

    },
    onSubmitNewDish() {

      console.log("Submitting dish:", this.form);
      //axios
      request
        .post("/api/dishes", this.form)
        .then((response) => {
          this.$message({
            type: "success",
            message: "菜品添加成功!",
          });
          console.log("Dish added successfully:", response.data);
          this.dialogFormVisible = false;
          this.getAll();
          this.handlePageChange(this.currentPage);
          //this.getAll();
        })
        .catch((error) => {
          console.error("Error adding dish:", error);

          let msg = "菜品添加失败，请稍后重试!";
          if (error.response && error.response.data) {
            msg = error.response.data.message || msg;
          }

          this.$message.error(msg);
        });

    },
    onUpdateDish() {
      console.log("Updating dish:", this.formUpdate);
      const { id, ...toupdate } = this.formUpdate;
      //axios
      request
        .put(`/api/dishes/${id}`, toupdate)
        .then((response) => {
          console.log("Dish updated successfully:", response.data);
          this.$message({
            type: "success",
            message: "菜品更新成功!",
          });
          this.dialogFormVisible = false;
          this.isEdit = false;
          this.getAll();
          this.handlePageChange(this.currentPage);
          //this.getAll();
        })
        .catch((error) => {
          console.error("Error updating dish:", error);

          let msg = "菜品更新失败，请稍后重试!";
          if (error.response && error.response.data) {
            msg = error.response.data.message || msg;
          }

          this.$message.error(msg);
        });
    },
    getAll() {
      console.log("request.get(`/api/dishes/all`)");
      //axios
      request
        .get(`/api/dishes/all`)
        .then((response) => {
          // this.tableData = response.data.data;
          console.log("response:\n", response);
          this.allData = response.data.data;
          this.total = this.allData.length;

          // 加载第一页
          this.currentPage = 1;
          this.updateTableData();
        })
        .catch((error) => {
          console.error("Error fetching dishes:", error);
        });
    },
    updateTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.tableData = this.allData.slice(start, end);
    }

  },


  mounted() {
    this.getAll();
    this.handlePageChange(1);
    console.log("mounted");
    //this.getAll();
  }
}
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
</style>
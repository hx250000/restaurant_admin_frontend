<template>
  <el-container class="layout-container">
    <!--<el-header>Header</el-header>-->
    <el-header class="header">
      餐厅后台管理
      <el-button style="float: right; margin-top: 10px;" type="danger" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!--<el-aside width="200px">Aside</el-aside>-->
      <el-aside width="200px" class="sidemenu">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title">
              <h3>管理选项</h3>
            </template>
            <el-menu-item-group>
              <!--<template slot="title">分组一</template>-->
              <el-menu-item index="1-1" class="">
                <router-link to="/user">用户管理</router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link to="/dish">菜品管理</router-link>
              </el-menu-item>
              <el-menu-item index="1-3">
                <router-link to="/question">订单管理</router-link>
              </el-menu-item>
            </el-menu-item-group>

          </el-submenu>

        </el-menu>
      </el-aside>

      <el-main>
        <!--顶部查询表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="formInline.keyword" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="success" @click="onAddNewUser">添加用户</el-button>

          </el-form-item>
        </el-form>

        <!--中间的table-->
        <el-table :data="tableData" style="width: 100%">
          <!-- <el-table-column label="序号" width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="用户名">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地  址">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户身份">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.role }}</span>
            </template>
          </el-table-column>
          <el-table-column label="添加日期">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">重置密码</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <!--分页-->
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
          :current-page="currentPage" @current-change="handlePageChange">
        </el-pagination>
        <!--弹出添加用户对话框-->
        <el-dialog title="添加新用户" :visible.sync="dialogFormVisible" width="500px">
          <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth">
              <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地  址" :label-width="formLabelWidth">
              <el-input v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密  码" :label-width="formLabelWidth">
              <el-input v-model="form.password" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth">
              <el-input v-model="form.checkPassword" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="用户身份" :label-width="formLabelWidth">
              <el-select v-model="form.userrole" placeholder="请选择用户角色">
                <el-option label="普通顾客" value="CUSTOMER"></el-option>
                <el-option label="管理员" value="ADMIN"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitNewUser">确 定</el-button>
          </div>
        </el-dialog>
        <!--弹出重置密码对话框-->
        <el-dialog title="重置密码" :visible.sync="dialogResetVisible">
          <el-form :model="formReset">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="formReset.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="新密码" :label-width="formLabelWidth">
              <el-input v-model="formReset.newPassword" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogResetVisible = false">取 消</el-button>
            <el-button type="primary" @click="onResetPassword">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//import axios from 'axios';
import request from "@/utils/request";

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogResetVisible: false,
      formLabelWidth: "100px",
      pageSize: 6, // 每页显示的条数
      total: 0,    // 总条数
      currentPage: 1,  //首页
      allData: [],
      form: {
        username: '',
        password: '',
        checkPassword: '',
        phone: '',
        address: '',
        userrole: 'CUSTOMER'
      },
      formReset: {
        username: '',
        newPassword: '123456'
      },
      formInline: {
        keyword: ''
      },
      tableData: []
    }
  },
  methods: {
    onAddNewUser() {
      this.dialogFormVisible = true;
    },
    onSubmit() {
      console.log('submit!');
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
      this.formReset.username = row.username;   // 自动带入用户名
      this.formReset.newPassword = "123456";    // 默认新密码
      this.dialogResetVisible = true;           // 打开对话框
      console.log(index, row);
    },
    handleDelete(index, row) {
      const id = row.id; // 获取当前用户的 id
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用删除接口（GET 请求）
          //axios
          request
            .delete(`/api/users/${id}`) // 使用 DELETE 请求传递 id 参数
            .then((response) => {
              console.log(response.data);
              // 删除成功后刷新当前页数据
              //this.handlePageChange(this.currentPage);
              this.getAll();
            })
            .catch((error) => {
              console.error("Error deleting user:", error);

              let msg = "用户删除失败，请稍后重试!";
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
    onSubmitNewUser() {
      console.log("Submitting user:", this.form);

      const password = this.form.password;
      const checkPassword = this.form.checkPassword;
      if (password !== checkPassword) {
        console.error("Error adding user: checkpassword");
        let msg = "两次输入的密码不一致!";
        this.$message.error(msg);
        return;
      }

      // axios
      request
        .post("/api/users/register", this.form)
        .then((response) => {
          console.log("user register successfully:", response.data);
          this.$message({
            type: "success",
            message: "用户添加成功!",
          });
          this.dialogFormVisible = false;
          //this.handlePageChange(this.currentPage);
          this.getAll();
        })
        .catch((error) => {
          console.error("Error adding user:", error);

          let msg = "用户添加失败，请稍后重试!";
          if (error.response && error.response.data) {
            msg = error.response.data.message || msg;
          }

          this.$message.error(msg);
        });
    },
    onResetPassword() {
      console.log("Resetting password for user:", this.formReset);
      // axios.
      request.
        put(
          `/api/users/reset`,
          {
              userName: this.formReset.username,
              newPassword: this.formReset.newPassword
            }
        )
        .then((response) => {
          console.log("Password reset successfully:", response.data);
          this.dialogResetVisible = false;
          this.$message({
            type: "success",
            message: "密码重置成功!",
          });
        })
        .catch((error) => {
          console.error("Error resetting password:", error);

          let msg = "重置密码失败，请稍后重试!";
          if (error.response && error.response.data) {
            msg = error.response.data.message || msg;
          }

          this.$message.error(msg);
        });
    },
    onSearch() {
      // 这里可以添加查询逻辑
      const keyword = this.formInline.keyword;
      console.log("Searching for:", keyword);
      // 例如，调用API获取数据
      if (!keyword||keyword=='') {
        // 如果关键字为空，加载第一页数据
        this.handlePageChange(1);
        //this.getAll();
        return;
      }
      //axios
      request
        .get(`/api/users/search?keyword=${this.formInline.keyword}`)
        .then((response) => {
          this.allData = response.data.data;   // ⭐ 搜索结果作为全量
          this.total = this.allData.length;
          this.currentPage = 1;
          this.updateTableData();
        })
        .catch((error) => {
          console.error("Error searching questions:", error);
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.updateTableData();
    },
    getAll() {
      request
        .get(`/api/users`)
        .then((response) => {
          console.log("response:\n", response);

          this.allData = response.data.data;   // ⭐ 全量数据
          this.total = this.allData.length;

          this.currentPage = 1;                // ⭐ 回到第一页
          this.updateTableData();              // ⭐ 切第一页数据
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    updateTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.tableData = this.allData.slice(start, end);
    }
  },
  mounted() {
    // 初始数据加载
    this.getAll();
    this.handlePageChange(1);

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

.el-menu-item a {
  color: inherit;
  text-decoration: none;
  display: block;
  /* 让点击区域覆盖整个菜单项 */
}

/*.el-menu-item a:hover {
    color: inherit;
    text-decoration: none;
  }*/
</style>
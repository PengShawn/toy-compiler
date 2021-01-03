<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div>
          <span>Toy Compiler</span>
          <span style="letter-spacing:1px; ">在线编译器</span>
        </div>
      </el-header>
      <el-main>
        <div>
          <el-card>
            <div class="io-card">
              <div class="code-txt">
                <div class="top-button">
                  <el-button type="success" icon="el-icon-s-promotion" size="small" @click="runCompiler" :loading="loadingBtn">点击运行
                  </el-button>
                  <el-button type="warning" icon="el-icon-brush" size="small" plain style="margin-left: 20px"
                             @click="clearCode">清空
                  </el-button>
                  <el-switch
                          style="margin-left: 20px"
                          v-model="lightTheme"
                          active-color="#5cb85c"
                          active-text="暗黑模式"
                          @change="changeTheme">
                  </el-switch>
                </div>
                <div id="code">
                  <codemirror v-model="code" :options="cmOption"/>
                </div>
              </div>
              <div class="out-txt">
                <div class="top-button">
                  <el-radio-group v-model="radio" @change="showCode">
                    <el-radio :label="1">tokenList</el-radio>
                    <el-radio :label="2">语法生成树</el-radio>
                    <el-radio :label="3">中间代码</el-radio>
                    <el-radio :label="4">符号表</el-radio>
                  </el-radio-group>
                </div>
                <el-input style="height: 500px;"
                          type="textarea"
                          :readonly="true"
                          :autosize="{ minRows: 24, maxRows: 24}"
                          placeholder="运行结果..."
                          v-model="resText">
                </el-input>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
      <el-footer>
        <el-tag :type="buildType" style="margin-top: 10px">Build Message:</el-tag>
        <div id="build-message">
          <el-input
                    type="textarea"
                    :readonly="true"
                    :autosize="{ minRows: 5, maxRows: 8}"
                    placeholder="运行结果..."
                    v-model="buildMessage">
          </el-input>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import dedent from 'dedent'
  import CodeMirror from 'codemirror'
  import {codemirror} from 'vue-codemirror'

  // theme css
  import 'codemirror/theme/solarized.css'


  let keywords = ["int", "real", "if", "then", "else", "while"];
  let operators = ["+", "-", "*", "/", "=", "==", "<", "<=", ">", ">=", "!="];
  let allResTxt = {};

  function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

  // define custom mode
  CodeMirror.defineMode('toy-mode', () => {
    return {
      token(stream, state) {
        if (stream.match("=")) {
          return 'operator'
        } else if (stream.match("+")) {
          return 'operator'
        } else if (stream.match("-")) {
          return 'operator'
        } else if (stream.match("*")) {
          return 'operator'
        } else if (stream.match("/")) {
          return 'operator'
        } else if (stream.match(">")) {
          return 'operator'
        } else if (stream.match("<")) {
          return 'operator'
        } else if (stream.match("!")) {
          return 'operator'
        } else if (stream.match(";")) {
          return 'number'
        } else if (stream.match(",")) {
          return 'number'
        } else if (stream.match("{")) {
          return 'number'
        } else if (stream.match("}")) {
          return 'number'
        } else if (stream.match("(")) {
          return 'number'
        } else if (stream.match(")")) {
          return 'number'
        }
        stream.eatWhile(/\w/);
        //console.log('测试打印',stream);
        if (arrayContains(stream.current(), keywords)) {
          return 'keyword'
        } else if (arrayContains(stream.current(), operators)) {
          return 'keyword'
        } else if (stream.match("12")) {
          return 'number'
        } else {
          stream.next();
          return null
        }
      }
    }
  });

  export default {
    name: 'Home',
    components: {
      codemirror
    },
    data() {
      return {
        code: `{\n int b = 100;\n real c = 0; \n while ( b > 0 ) {\n  c = c + b;\n  b = b -1;\n }\n}`,
        cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: 'toy-mode',
          theme: 'solarized light'
        },
        lightTheme: false,
        resText: '',
        radio: 1,
        buildMessage: '',
        loadingBtn: false,
        buildType: 'info',
      }
    },
    methods: {
      changeTheme() {
        if (this.lightTheme) this.cmOption.theme = 'solarized dark';
        else this.cmOption.theme = 'solarized light'
      },
      async runCompiler() {
        this.buildType = 'info';
        this.buildMessage = '';
        if (this.code === '')
          return this.$message.info('请先输入代码再点击运行');
        this.loadingBtn = true;
        let config = {
          method: 'post',
          url: 'http://localhost:8020/build',
          headers: {
            'Content-Type': 'text/plain'
          },
          data : this.code
        };
        console.log('发送过去的信息',config);
        const {data: res} = await this.$axios(config);
        console.log('返回信息',res);
        allResTxt = res;
        this.radio = 1;
        this.resText = res.tokenList;
        this.buildMessage = res.buildMessage;
        if(this.buildMessage.indexOf('BUILD SUCCESS') !== -1)
          this.buildType = 'success';
        else
          this.buildType = 'danger';
        this.loadingBtn = false;
      },
      async clearCode() {
        const confirmResult = await this.$confirm(
            '确认清空?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消清空')
        }
        this.code = ''
      },
      showCode() {
        switch (this.radio) {
          case 1:
            this.resText = allResTxt.tokenList;
            break;
          case 2:
            this.resText = allResTxt.parseTree;
            break;
          case 3:
            this.resText = allResTxt.interCode;
            break;
          case 4:
            this.resText = allResTxt.symbolTable;
            break;
          default:
            break;
        }
      }
    }
  }
</script>

<style lang="less">
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #96b97d;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      > span {
        margin-left: 25px;
        font-weight: 700;
      }
    }
  }

  .el-main {
    background-color: #eaedf1;
    height: 100%;
  }

  .top-button {
    height: 48px;
    line-height: 45px;
  }

  .io-card {
    display: flex;
    margin-bottom: 50px;
  }

  #code {
    .CodeMirror {
      height: 516px;
      font-size: 15px;
    }
  }
  .code-txt {
    flex: 1;
    margin-right: 20px;
    height: 500px;
  }

  .out-txt {
    flex: 1;
    margin-right: 20px;
  }

  #build-message {
    margin-top: 10px;
    .el-textarea__inner{
      font-size: 20px;
      background-color: lightslategray;
      color: #eaedf1;
    }
  }
</style>

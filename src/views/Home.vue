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
                  <el-button type="success" icon="el-icon-s-promotion" size="small" @click="runCompiler">点击运行
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
        <el-tag type="success" style="margin-top: 10px">Build Message:</el-tag>
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
        code: `int bbb = 222; ,\nreal ccc = 111; if(bbb > 0 )\nwhile ( )`,
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
        buildMessage: ''
      }
    },
    methods: {
      changeTheme() {
        if (this.lightTheme) this.cmOption.theme = 'solarized dark';
        else this.cmOption.theme = 'solarized light'
      },
      async runCompiler() {
        if (this.code === '')
          return this.$message.info('请先输入代码再点击运行');
        let config = {
          method: 'post',
          url: 'http://localhost:8020/build',
          headers: {
            'Content-Type': 'text/plain'
          },
          data : this.code
        };
        const {data: res} = await this.$axios(config);
        console.log('返回信息',res);
        // let res = {
        //   symbolTable: "a 100.0\njint 0.0\n",
        //   buildMessage: "BUILD SUCCESS!",
        //   tokenList: "{ DELIMITER 0 0\r\na ID 1 4\r\n= OPERATOR 1 6\r\n0 NUM 1 8\r\n; DELIMITER 1 9\r\nwhile KEYWORD 2 4\r\n( DELIMITER 2 9\r\na ID 2 10\r\n< OPERATOR 2 12\r\n100 NUM 2 14\r\n) DELIMITER 2 17\r\n{ DELIMITER 2 18\r\na ID 3 8\r\n= OPERATOR 3 10\r\na ID 3 12\r\n+ OPERATOR 3 13\r\n1 NUM 3 14\r\n; DELIMITER 3 15\r\n} DELIMITER 4 4\r\n} DELIMITER 5 0\r\n",
        //   parseTree: "program\ncompoundstmt\n{\nstmts\nstmt\nassgstmt\na\n=\narithexpr\nmultexpr\nsimpleexpr\n0\nmultexprprime\n?\narithexprprime\n?\n;\nstmts\nstmt\nwhilestmt\nwhile\n(\nboolexpr\narithexpr\nmultexpr\nsimpleexpr\na\nmultexprprime\n?\narithexprprime\n?\nboolop\n<\narithexpr\nmultexpr\nsimpleexpr\n100\nmultexprprime\n?\narithexprprime\n?\n)\nstmt\ncompoundstmt\n{\nstmts\nstmt\nassgstmt\na\n=\narithexpr\nmultexpr\nsimpleexpr\na\nmultexprprime\n?\narithexprprime\n+\nmultexpr\nsimpleexpr\n1\nmultexprprime\n?\narithexprprime\n?\n;\nstmts\n?\n}\nstmts\n?\n}\n",
        //   interCode: "a=0\nL0\nif a>=100 goto L1\ngoto L0\nL1\n"
        // };
        allResTxt = res;
        this.radio = 1;
        this.resText = res.tokenList;
        this.buildMessage = res.buildMessage;
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
        margin-left: 30px;
        font-weight: 700;
      }
    }
  }

  .el-main {
    background-color: #eaedf1;
    height: 100%;
  }

  .el-textarea__inner{
    font-family:"Microsoft",serif;
    font-size: 20px;
  }

  .el-textarea__inner,.el-input__inner{
    background: transparent;
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

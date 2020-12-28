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
            <div class="top-button">
              <el-button type="success" icon="el-icon-s-promotion" size="small" >点击运行</el-button>
              <el-switch
                      style="margin-left: 20px"
                      v-model="lightTheme"
                      active-color="#5cb85c"
                      active-text="暗黑模式"
                      @change="changeTheme">
              </el-switch>
            </div>
            <codemirror v-model="code" :options="cmOption" class="code-txt"/>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import dedent from 'dedent'
  import CodeMirror from 'codemirror'
  import { codemirror } from 'vue-codemirror'

  // theme css
  import 'codemirror/theme/solarized.css'


  let keywords = ["int", "real", "if", "then", "else", "while"];
  let operators = ["+", "-", "*", "/", "=", "==", "<","<=",">",">=","!="];
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
        if(arrayContains(stream.current(), keywords) ){
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
  })
  export default {
    name: 'Home',
    components: {
      codemirror
    },
    data() {
      return {
        code: `int bbb = 222; ,\nreal ccc = 111; if(bbb > 0 )\neee fff ggg`,
        cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: 'toy-mode',
          theme: 'solarized light'
        },
        lightTheme: false
      }
    },
    methods:{
      changeTheme() {
        if(this.lightTheme) this.cmOption.theme = 'solarized dark';
        else this.cmOption.theme = 'solarized light'
      }
    }
  }
</script>

<style lang="less" scoped>
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

  .top-button {
    margin-bottom: 10px;
  }
  .code-txt {
    width: 500px;
  }
</style>

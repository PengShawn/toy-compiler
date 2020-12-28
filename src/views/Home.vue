<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div>
          <span>Toy Compiler</span>
          <span style="letter-spacing:1px; ">简单编译器</span>
        </div>
      </el-header>
      <el-main>
        <div>
          Main
          <codemirror v-model="code" :options="cmOption" />
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

  // define custom mode
  CodeMirror.defineMode('toy-mode', () => {
    return {
      token(stream, state) {
        //console.log('测试打印',stream);
        if (stream.match('int')) {
          return 'keyword'
        } else if (stream.match('real')) {
          return 'keyword'
        } else if (stream.match('if')) {
          return 'keyword'
        } else if (stream.match('then')) {
          return 'keyword'
        } else if (stream.match('else')) {
          return 'keyword'
        } else if (stream.match('while')) {
          return 'keyword'
        } else if (stream.match("^[1-9]$")) {
          return 'number'
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
        code: `int bbb = 222;\nreal ccc = 111; if(bbb > 0 )\neee fff ggg`,
        cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: 'toy-mode',
          theme: 'solarized light'
        }
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
</style>

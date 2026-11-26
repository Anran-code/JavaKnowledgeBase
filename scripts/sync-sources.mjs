import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { codeToHtml } from 'shiki'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await fs.readFile(path.join(root, 'knowledge.config.json'), 'utf8'))
const sourceRoot = path.resolve(root, config.sourceRoot)
const entries = [
  ['hello','01-HelloWorld/src/com/ranan/obj/helloworld/HelloWorld.java',1,7],
  ['basic','02-basic/src/com/ranan/obj/basic/Basic.java',12,18],
  ['types','02-basic/src/com/ranan/obj/type/Type.java',4,12],
  ['overload','02-basic/src/com/ranan/obj/basic/MethodOverload.java',4,15],
  ['scanner','02-basic/src/com/ranan/obj/scanner/MyScanner.java',15,29],
  ['random','02-basic/src/com/ranan/obj/basic/Basic.java',25,32],
  ['array','04-array/src/com/ranan/obj/array/Array.java',28,42],
  ['array2d','04-array/src/com/ranan/obj/array/Array2D.java',10,21],
  ['poker','04-array/src/com/ranan/obj/array/Poker.java',9,23],
  ['puzzle','04-array/src/com/ranan/obj/array/HuaRongRoadDemo.java',29,43],
  ['practice','02-basic/src/com/ranan/obj/practice/Practice.java',6,23],
  ["flow-if", "03-flow-control/src/com/ranan/obj/branch/IfBranch.java", 26, 36],
  ["flow-switch", "03-flow-control/src/com/ranan/obj/branch/SwitchBranch.java", 16, 27],
  ["flow-while", "03-flow-control/src/com/ranan/obj/loop/While.java", 10, 19],
  ["flow-nested", "03-flow-control/src/com/ranan/obj/loop/NestedLoop.java", 12, 18],
  ["flow-calculator", "03-flow-control/src/com/ranan/obj/practice/SimpleCalculator.java", 44, 63],
  ["flow-verification", "03-flow-control/src/com/ranan/obj/practice/VerificationCode.java", 31, 52],
  ["flow-guess", "03-flow-control/src/com/ranan/obj/practice/GuessNumber.java", 18, 42],
  ["flow-prime", "03-flow-control/src/com/ranan/obj/practice/PrimeNumberPrint.java", 11, 30],
  ["flow-do", "03-flow-control/src/com/ranan/obj/loop/DoWhile.java", 8, 14],
  ["flow-for", "03-flow-control/src/com/ranan/obj/loop/For.java", 8, 12],
  ["oop-star", "05-oop/src/com/ranan/obj/Star.java", 3, 8],
  ["oop-star-test", "05-oop/src/com/ranan/obj/Test.java", 4, 10],
  ["oop-student", "05-oop/src/com/ranan/obj/Student.java", 8, 18],
  ["oop-student-test", "05-oop/src/com/ranan/obj/Test2.java", 4, 11],
  ["oop-encapsulation", "05-oop/src/com/ranan/encapsulation/Student.java", 12, 28],
  ["oop-encapsulation-test", "05-oop/src/com/ranan/encapsulation/Test.java", 4, 11],
  ["oop-static-student", "05-oop/src/com/ranan/staticfield/Student.java", 3, 11],
  ["oop-static-test", "05-oop/src/com/ranan/staticfield/Test.java", 4, 15],
  ["oop-movie", "05-oop/src/com/ranan/practice/Movie.java", 3, 15],
  ["oop-movie-system", "05-oop/src/com/ranan/practice/MovieSystem.java", 4, 26],
  ["oop-movie-search", "05-oop/src/com/ranan/practice/MovieSystem.java", 50, 62],
  ["oop-practice", "05-oop/src/com/ranan/practice/Practice.java", 5, 29]
]
const generated = path.join(root, 'docs/.vitepress/theme/generated')
const downloads = path.join(root, 'docs/public/sources')
await fs.mkdir(generated, {recursive:true})
await fs.mkdir(downloads, {recursive:true})
const sources = {}
for(const [id, relative, start, end] of entries) {
  const absolute = path.resolve(sourceRoot, relative)
  if(!absolute.startsWith(sourceRoot+path.sep)) throw new Error('Source path outside configured source root')
  const code = (await fs.readFile(absolute,'utf8')).replace(/\r\n/g,'\n')
  const excerpt = code.split('\n').slice(start-1,end).join('\n')
  const options={lang:'java',themes:{light:'github-light',dark:'github-dark'}}
  sources[id]={id,path:relative,name:path.basename(relative),start,end,code,excerpt,
    html:await codeToHtml(code,options),excerptHtml:await codeToHtml(excerpt,options),
    sha256:createHash('sha256').update(code).digest('hex')}
  await fs.writeFile(path.join(downloads,id+'.java'),code)
}
await fs.writeFile(path.join(root,'docs/public/notes/flow.md'),await fs.readFile(path.join(sourceRoot,'notes/02程序流程控制.md'),'utf8'))
await fs.writeFile(path.join(root,'docs/public/notes/objects.md'),await fs.readFile(path.join(sourceRoot,'notes/03面向对象.md'),'utf8'))
const original = await fs.readFile(path.join(sourceRoot,config.notesFile),'utf8')
await fs.writeFile(path.join(root,'docs/public/source-notes.md'),original)
await fs.writeFile(path.join(generated,'sources.json'),JSON.stringify(sources,null,2))
await fs.writeFile(path.join(generated,'meta.json'),JSON.stringify({
  sourceRoot:config.sourceRoot,note:config.notesFile,basicSourceCount:10,flowSourceCount:10,oopSourceCount:11,sourceCount:new Set(entries.map(e=>e[1])).size,syncedAt:new Date().toISOString()
},null,2))
console.log('已只读同步 '+new Set(entries.map(e=>e[1])).size+' 个 Java 源文件和已整理章节的原笔记；原项目未修改。')

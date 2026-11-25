import CatalogPage from './components/CatalogPage.vue'
import DefaultTheme from 'vitepress/theme'
import ChapterHome from './components/ChapterHome.vue'
import SourceCode from './components/SourceCode.vue'
import ReadingTools from './components/ReadingTools.vue'
import './style.css'
export default {extends:DefaultTheme,enhanceApp({app}){app.component('CatalogPage',CatalogPage);app.component('ChapterHome',ChapterHome);app.component('SourceCode',SourceCode);app.component('ReadingTools',ReadingTools)}}

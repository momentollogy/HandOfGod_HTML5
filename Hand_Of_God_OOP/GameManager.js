import Level_01 from './Level_01.js'
import Level_02 from './Level_02.js'
import Level_03 from './Level_03.js'
import Level_04 from './Level_04.js'
import Level_05 from './Level_05.js'
import Level_StageSelect from './Level_StageSelect.js'
import Level_06 from './Level_06_LineIntersectTest.js'

export default class GameManager {
    constructor() 
    {
       //this.currentLevel = new Level_StageSelect()
       this.currentLevel = new Level_06()
    }    
}
import Level_01 from './Level_01.js'
import Level_02 from './Level_02.js'
import Level_03 from './Level_03.js'
import Level_04 from './Level_04.js'
import Level_05 from './Level_05.js'

export default class GameManager {
    constructor() 
    {
        this.currentLevel = new Level_05()
    }    
}
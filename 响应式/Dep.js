// 收集管理依赖
export default class Dep{
    constructor() {
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
    }
    removeSub(sub){
        let index = this.subs?.indexOf(sub)
        if(index!==-1){
            return this.subs.splice(index,1)
        }
    }
    depend(){
        if(window.target){
            this.addSub(window.target)
        }
    }
    notify(){
        const subs = this.subs.slice();
        for(let i=0;i<subs.length;i++){
            subs[i].update();
        }
    }
}
// 将一个数据内的所有属性包括子属性都转换成getter/setter
import Dep from "./Dep.js";
import { arrayMethods } from "./Array.js";
import { def, isObject } from "./tools.js";

const hasProto = '__proto__' in {};
const  arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer{
    constructor(value) {
        this.value = value
        this.dep = new Dep();
        def(value,'__ob__',this)
        if(Array.isArray(value)){
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value,arrayMethods,arrayKeys)
            this.observeArray(value)
            // value.__proto__ = arrayMethods
        }else{
            this.walk(value)
        }
    }
    walk(obj){
        const keys = Object.keys(obj);
        for (let i=0;i<keys.length;i++){
            defineReactive(obj,keys[i],obj[keys[i]])
        }
    }
    observeArray (value) {
        for (let i = 0, l = value.length; i < l; i++) {
            observe(value[i])
        }
    }
}
function defineReactive(obj,key,val){
    /*if(typeof val === 'object'){
        new Observer(val)
    }*/
    let childOb = observe(val);
    let dep = new Dep();
    Object.defineProperty(obj,key,{
        enumerable: true,
        configurable: true,
        get(){
            dep.depend();
            if(childOb){
                childOb.dep.depend()
            }
            return val;
        },
        set(newVal){
            if(val===newVal) return;
            val = newVal;
            debugger
            dep.notify()
        }
    })
}

export function observe(value,asRootData){
    if(!isObject(value)) return;
    let ob;
    if(Object.prototype.hasOwnProperty(value,"__ob__") && value.__ob__ instanceof Observer){
        ob = value.__ob__
    }else{
        ob = new Observer(value)
    }
    return ob;
}

function protoAugment(target,src,keys){
    target.__proto__ = src;
}

// 若浏览器不支持__proto__，则循环将arrayMethods里的方法赋到target上
function copyAugment(target,src,keys){
    for (let i=0;i<keys.length;i++){
        def(target,keys[i],src[keys[i]])
    }
}
const ns = 'simplecalc:'
export default {
  load(key){
    try{ const v = localStorage.getItem(ns+key); return v ? JSON.parse(v) : null }catch(e){ return null }
  },
  save(key, value){
    try{ localStorage.setItem(ns+key, JSON.stringify(value)) }catch(e){}
  },
  remove(key){ try{ localStorage.removeItem(ns+key) }catch(e){}
  }
}

const fs = require('fs')
const path = require('path')
const DATA = path.join(__dirname, '..', '..', 'data')
const FILE = path.join(DATA, 'history.json')

if(!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true })
if(!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]')

function read(){
  try{ return JSON.parse(fs.readFileSync(FILE,'utf8')) }catch(e){ return [] }
}
function write(arr){ fs.writeFileSync(FILE, JSON.stringify(arr, null, 2)) }

function get(){ return read() }
function save(entry){
  const arr = read()
  arr.unshift(entry)
  write(arr.slice(0,50))
}

module.exports = { get, save }

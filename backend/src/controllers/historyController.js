const historyService = require('../services/historyService')

exports.getHistory = async (req,res,next) =>{
  try{
    const items = historyService.get()
    res.json({ items })
  }catch(err){ next(err) }
}

exports.saveHistory = async (req,res,next) =>{
  try{
    const entry = req.body
    historyService.save(entry)
    res.status(201).json({ ok: true })
  }catch(err){ next(err) }
}

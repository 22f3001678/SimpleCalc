const calculatorService = require('../services/calculatorService')

exports.evaluate = async (req,res,next) =>{
  try{
    const { expression } = req.body
    if(!expression) return res.status(400).json({ error: 'Missing expression' })
    const result = calculatorService.evaluate(expression)
    res.json({ result })
  }catch(err){ next(err) }
}

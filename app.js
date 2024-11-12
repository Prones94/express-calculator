const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()


// Utility functions
function calculateMean(nums){
  return nums.reduce((a,b) => a + b, 0) / nums.length
}

function calculateMedian(nums){
  nums.sort((a,b) => a - b)
  const mid = Math.floor(nums.length / 2)
  return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

function calculateMode(nums) {
  const frequency = {}
  nums.forEach(num => (frequency[num] = (frequency[num] || 0) + 1))
  let maxCount = 0
  let mode = []
  for (let num in frequency){
    if (frequency[num] > maxCount){
      mode = [Number(num)]
      maxCount = frequency[num]
    } else if (frequency[num] === maxCount){
      mode.push(Number(num))
    }
  }
  return mode.length === nums.length ? [] : mode
}

// Error handling
function parseNums(req,res,next){
  if (!req.query.nums) {
    return res.status(400).json({ error: 'nums are required' })
  }
  const nums = req.query.nums.split(',').map(num => {
    const parsed = parseFloat(num)
    if (isNaN(parsed)){
      res.status(400).json({ error: `${num} is not a number`})
      return
    }
    return parsed
  })
  if (res.headersSent) return
  req.nums = nums
  next()
}

// Routes
app.get('/mean', parseNums, (req,res) => {
  const mean = calculateMean(req.nums)
  res.json({ operation: 'mean', value: mean})
})

app.get('/median', parseNums, (req,res) => {
  const median = calculateMedian(req.nums)
  res.json({ operation: 'median', value: median })
})

app.get('/mode', parseNums, (req,res) => {
  const mode = calculateMode(req.nums)
  res.json({ operation: 'mode', value: mode })
})

app.get('/all', parseNums, (req,res) => {
  const mean = calculateMean(req.nums)
  const median = calculateMedian(req.nums)
  const mode = calculateMode(req.nums)
  const response = {
    operation: 'all',
    mean,
    median,
    mode
  }

  if (req.query.save === 'true'){
    const timestamp = new Date().toISOString()
    const dataToSave = {...response, timestamp }
    fs.writeFileSync(
      path.join(__dirname, 'results.json'),
      JSON.stringify(dataToSave, null, 2)
    )
  }

  if (req.headers.accept && req.headers.accept.includes('text/html')){
    let htmlResponse = `
      <html>
        <head><title>All Operations</title></head>
        <body>
          <h1>All Operations</h1>
          <p>Mean: ${mean}</p>
          <p>Median: ${median}</p>
          <p>Mode: ${mode}</p>
        </body>
      </html>
    `
    return res.send(htmlResponse)
  }
  res.json(response)
})

module.exports = app
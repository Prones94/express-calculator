const request = require('supertest')
const app = require('./app')

describe('GET /mean', () => {
  it('should return the mean of the given numbers', async () => {
    const res = await request(app).get('/mean?nums=1,2,3,4,5')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ operation: 'mean', value: 3 })
  })

  it('should return a 400 error for invalid input', async() => {
    const res = await request(app).get('/mean?nums=1,foo,3')
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'foo is not a number' })
  })

  it('should return a 400 error if nums are not provided', async() => {
    const res = await request(app).get('/mean')
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'nums are required' })
  })
})

describe('GET /median', () => {
  it('should return the median of the given numbers', async() => {
    const res = await request(app).get('/median?nums=1,2,3,4,5')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ operation: 'median', value:3 })
  })
})

describe('GET /mode', () => {
  it('should return the mdoe of the given numbers', async() => {
    const res = await request(app).get('/mode?nums=1,2,2,3,4')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ operation: 'mode', value: [2] })
  })
})
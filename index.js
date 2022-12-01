const express = require('express')
const app = express()
const axios = require('axios')
const cheerio  = require('cheerio')
const { response } = require('express')



const port = 4567

const articles = [
    {
        name: 'litterrobotblog',
        address:'https://www.litter-robot.com/blog/30-fascinating-cat-facts/'
        

    },
    {
        name: 'livescience',
        address:'https://www.livescience.com/search?searchTerm=cats'
        

    }
]

const info = []


articles.forEach(article  => {
    axios.get(article.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("cat")',html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            info.push({
                title,
                url,
                source: article.name

            })

        })
    })

})

app.get("/", (req,res)=> {
    res.json('Welcome to my cat info API. Do not forget to read the github before using it :)')

})

app.get('/news',(req,res)=> { 
       res.json(info)
    
        })

app.get('/news/:articleId',(req,res) => {
    const articleId = req.params.articleId 

   const articleAddress = articles.filter(article => article.name == articleId)[0].address

   axios.get(articleAddress)
   .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("cat")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url,
                source: articleId
            })
        })

        res.json(specificArticles)
   }).catch(err => console.log(err))


})



app.listen(port,() => {
    console.log(`Listening on port ${port}`)
})
# Comentario APP

## Requisitos

- npm module fs
- npm module express
- npm module path
- npm module mysql
- npm module ibmwatson
- npm module bodyParser

Dependencias completas em package-lock.json e package.json

## Funcionamento básico

- Recebe api key do Watson e url para uso do text-to-speech (./server.js)

- Dados para iniciar db do mysql (/lib/db.js)

- usa nodemon com o comando npm run dev

1. App inicia na porta 3000
2. Cria db no mysql se não existe
3. Adicionar comentario ao fim da linha (caso já haja)
4. Chama a função do text-to-speech do Watson para sintetizar audio
5. Cria os elementos html

### Agradecimentos

Aos colegas da area  [Roberto](https://github.com/flourigh) , [Mayk](https://github.com/maykbrito) e [Kaio](http://github.com/KaioGomesx) pelo na identificação e entender os erros e como soluciona-los.  


*PS: há audios inclusos que mostram exemplos da sintetização*.

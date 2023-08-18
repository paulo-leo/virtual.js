#O Virtual.js atua como um tipo de transpilador, viabilizando uma abordagem reativa para todas as variáveis JavaScript no contexto observável. É importante ressaltar que o Virtual.js ainda está em estágio experimental, e atualmente requer um consumo de memória considerável ao ser utilizado. Recomendamos, portanto, que seu uso não seja aplicado em cenários de desenvolvimento, mas sim restrito a propósitos estritamente didáticos. Sinta-se à vontade para implementar aprimoramentos no código conforme necessário.

## void $v.set(string name, string value)
Cria ou atualiza o valor de um estado.

## string | float | int  | object | bool $v.get(string name)
Recupera o valor atual de um estado.

## void $v.fill(object values)
Cria ou atualiza chaves/nomes de estados por meio de um objeto. 
Exemplo: 
$v.fill({name:"Paulo", phone:"54545454"});
let phone = $v.get("phone"); 
console.log(phone); //Output: 54545454 

## bool $v.has(string name)
Verifica se um determinado estado existe.

## void $v.el(string selector)
Define o seletor padrão para funcionamento da lib. 

## void $v.watch(string name, function call)
Executa uma função de callback toda vez que um estado for renderizado. É possível recuperar todos os estados passando um argumento qualquer no callback.
Exemplo:
$v.watch('name',function(e){
  console.log(e.name);
  console.log(e);
})
## void $v.list(object data, string template)
Renderiza uma lista(de estados):
$v.list($v.get("names"),(e)=>{
    return `<p>${e.name}</p>`;
})

## object $v.url()
Retorna todos os dados da URL atual.

## Sistema de roteamento.
O sistema de rotas do Virtual.JS é baseado em hash (#). 
## void  $v.route(string route, function call);

* = Pega todas as rotas não existentes (404).
/ = Index, ou rota inicial. 

## Diretivas
As diretivas é uma forma de estender as funcionalidades HTML da página por meio de JavaScript. 
##  for
Renderiza um bloco de repetição ao fornecer um estado.

    <ul  for="r in results"  class="list-group">
        <li  class="list-group-item">
        <h5>${r.name}</h5>
           <a  href="${r.url}"  target="_blank">Link</a>
       </li>
    </ul>

##  if
Renderiza um bloco de repetição ao fornecer um teste verdadeiro
Caso o teste seja feito com um estado, basta usar a palavra reservado "this"

    <h3  if="!this.loading">Esse é um show</h3>
    <h3  if="10 > 5">ok</h3>

##  show
Mostra o conteúdo se o teste for verdadeiro. 

    <h3 show="!false">Esse é um show</h3>

##  key
Muda o valor ou texto da tag de acordo com o valor do estado fornecido
    
##  model
Faz um vinculo direto ao estado fornecido

    <input  model="name"  key="name"  type="text">
    <h1>${name}</h1>

'use strict'

class LogicoController {
    index ({ view })
    {
        /* Questão 1 */
        var array_to_sort = [9,3,2,19,3,4,10,34,-99,99]
        var questao1 = sort(array_to_sort)

        function sort(a)
        {
            // Metodo de Bubble Sort
            var sup = 0

            for(var v = 0; v < a.length; v++)
            {
                for(var i=0; i < a.length; i++)
                {
                    if(a[i] > a[i+1])
                    {
                        sup = a[i] 
                        a[i] = a[i+1] 
                        a[i+1] = sup
                    }
                }
            }

            return a
        }
        
        /* Fim questão 1 */

        /* Questão 2 */
        var numero = 10          // Mude este valor para testar (apenas numeros inteiros e positivos)
        var questao2 = fatorial(numero)
        
        function fatorial(num)
        {
            var result = 1

            if(num <= 0 || !Number.isInteger(num))
            {
                result = 'Valor inválido'
            }
            else
            {
                for(var sup = num; sup > 0; sup--)
                {
                    result *= sup
                }
            }

            return `${result}`
        }
        /* Fim Questão 2 */


        /* Questão 3 */
        var tamanho = 10         // Mude este valor para alterar o número de elementos (apenas números maiores ou iguais a 2)
        var questao3 = fibo(tamanho)

        function fibo(tam)
        {
            var result = [0,1]
            
            if(tam < 2)
            {
                result = 'Numero de elementos inválido'
            }
            else
            {
                for(var i = 1; i <= tam; i++)
                {
                    result[i+1] = result[i-1] + result[i]
                }
            }

            return result
        }
        /* Fim Questão 3 */
        

        /* Questão 4 */
        var dataset = [193,123, 44, 9, 44, 801, 1800, 44, 98, 801, 999, 1780]
        var questao4 = estatistica(dataset)

        function estatistica(dados)
        {
            // Calculando a média
            var med = media(dados)

            // Calculando a moda
            var mod = moda(dados)

            // Calculando a mediana
            var median = mediana(dados)

            var teste = sort(dados)

            var obj = { media:`${med}`, moda:`${mod}`, mediana:`${median}`, i:teste}
            return obj
        }

        // Calculando Média
        function media(d)
        {
            var med = 0

            for(var i = 0; i < d.length; i++)
            {
                med += d[i]
            }
            med = med/i

            return med
        }

        // Calculando Moda
        function moda(d)
        {
            var ref = {}
            var mod = { index: 0, valor: 0 }
            var i

            for(i in d)
            {
                ref[d[i]] = d[i] in ref ? ref[d[i]] + 1 : 0
                if(ref[d[i]] > mod.valor)
                {
                    mod.index = d[i]
                    mod.valor = ref[d[i]]
                }
            }

            return mod.index
        }

        // Calculando Mediana
        function mediana(d)
        {
            var median = 0
            var d_organizados = sort(d)
            var i = (Math.ceil(d.length/2))

            if(d.length % 2 == 0)
            { 
                median = (d_organizados[i-1]+d_organizados[i])/2
            }
            else
            {
                median = d_organizados[i-1]
            }
            
            return median
        }
        /* Fim Questão 4 */


        /* Questão 5 */
        var objeto1 = {x1:1, y1:1, x2:2, y2:2}, objeto2 = {x1:10, y1:10, x2:11, y2:11} // Mude aqui os valores
        var questao5 
        
        if(game(objeto1, objeto2)) // Só pra aparecer na view
        {
            questao5 = 'True'
        }
        else
        {
            questao5 = 'False'
        }

        function game(obj1, obj2)
        {
            if(obj1.x1 == obj2.x1 || obj1.x2 == obj2.x2 || obj1.y1 == obj2.y1 || obj1.y2 == obj2.y2)
            {
                return true
            }
            else
            {
                return false
            }
        }
        /* Fim Questão 5 */

        return view.render('logico', {
            questao1: questao1,
            questao2: `${questao2}`,
            questao3: questao3,
            questao4: questao4,
            questao5: questao5
        })
    }
}

module.exports = LogicoController

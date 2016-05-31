## Install
```
git clone https://github.com/xgbuils/selenium-promise-experiment.git
npm install
```
## Tests
```
npm test
```


## Explicación

Imaginemos que tenemos una función `all` tal como la del objeto promise de webdriver. Dicha función acepta un array de promesas, y devuelve una promesa que tendrá éxito o fallará en función de cómo se resuelvan el array de promesas pasado. En términos generales pueden haber 3 casos de interés a ver:

#### 1) Pasamos un array 4 de promesas que **todas terminan con éxito**:
- La primera promesa es resuelta exitosamente a los 150ms con el valor 150
- La segunda promesa es resuelta exitosamente a los 50ms con el valor 50
- La tercera promesa es resuelta exitosamente a los 100ms con el valor 100
- La cuarta promesa es resuelta exitosamente a los 200ms con el valor 200

Dicho caso es el que es creado por la función `createEveryPromiseIsFulfilled` en el fichero `test.js`.

En ese caso, como dice la documentación, `all` devuelve una promesa que resuelve con el array de valores exitosos. Eso es lo que prueba el **primer** test unitario de `test.js`

#### 2) Pasamos un array 4 de promesas que **todas fallan**:
- La primera promesa es resuelta fallidamente a los 150ms con el error 150
- La segunda promesa es resuelta fallidamente a los 50ms con el error 50
- La tercera promesa es resuelta fallidamente a los 100ms con el error 100
- La cuarta promesa es resuelta fallidamente a los 200ms con el error 200

Dicho caso es el que es creado por la función `createEveryPromiseIsRejected` en el fichero `test.js`.

En ese caso, `all` devuelve una promesa que resuelve fallidamente con el error de la primera promesa que falla. Cabe destacar que no es la primera promesa fallida en relación a la posición en el array. Sino que las promesas se ejecutan **paralelamente** y es la primera promesa fallida en relación al **tiempo** en fallar. Eso es lo que prueba el **segundo** test unitario de `test.js`

#### 3) Pasamos un array 4 de promesas que **algunas fallan y otras no**:
- La primera promesa es resuelta fallidamente a los 150ms con el error 150
- La segunda promesa es resuelta exitosamente a los 50ms con el valor 50
- La tercera promesa es resuelta fallidamente a los 100ms con el error 100
- La cuarta promesa es resuelta exitosamente a los 200ms con el valor 200

Dicho caso es el que es creado por la función `createOddFulfilledEvenRejected` en el fichero `test.js`.

En ese caso, `all`, igualmente, devuelve una promesa que resuelve fallidamente con el error de la primera promesa que falla. En este caso, la tercera promesa. Cabe volver a destacar que no es la primera promesa fallida en relación a la posición en el array. Sino que las promesas se ejecutan **paralelamente** y es la primera promesa fallida en relación al **tiempo** en fallar. Eso es lo que prueba el **tercer** test unitario de `test.js`


## Implementación de la función any

Al igual que la función `all` devuelve una promesa que resuelve exitosamente cuando **todas** las promesas son exitosas (en caso contrario fallará). Es de entender que la función `any` deberá devolver una promesa exitosa cuando **alguna** promesa sea exitosa (en caso contrario fallará).

Del comportamiento en paralelo de `all`. Deberíamos entender que `any` también debería comportarse así. Es decir, si la función `any` encuentra una promesa que resuelve exitosamente antes que otra que se encuentra en una posición anterior del array, ya sabremos que existe una promesa exitosa. Por lo tanto, no hay que esperar más. En resumen, `any` también debería ejecutar las promesas en paralelo.

Por otro lado, si `all` recibe un array de promesas, por simetría, deberíamos asumir que `any` también admitirá recibir lo mismo (un array de promesas), ni más ni menos.

Una vez asumido lo anterior expongamos los 3 casos de interés expuestos en con `all` y deduzcamos que debería pasar con la función `any`:

#### 1) Pasamos un array 4 de promesas que **todas terminan con éxito**:

`any` comprueba si hay **alguna** promesa exitosa. Con la primera (temporalmente hablando) que se resuelva a exitosamente ya vale. De modo que devolverá el valor de la primera promesa que se resuelva con éxito. Eso es lo que prueba el **cuarto** test unitario de `test.js` de la implementación de `any` en `index.js`

#### 2) Pasamos un array 4 de promesas que **todas fallan**:

`any` comprueba si hay **alguna** promesa exitosa. Si **no hay alguna**, es decir, si no hay **ninguna** promesa exitosa, la promesa que retorne deberá fallar. Para comprobar que ninguna promesa resuelve con éxito no hay más remedio que esperar hasta que la última promesa resuelva, para poder saber si todas fallan. Pero, entonces, de todas las promesas que han fallado, ¿con cuál nos quedamos como error? Por simetría con `all` en la que si todas las promesas tenían éxito, resolvía en un array de valores exitosos. Aquí para `any` debería pasar lo mismo: si todas las promesas fallan, deberá volver un error con la lista de errores de todas las promesas fallidas. Esto es lo que prueba el **quinto** test unitario de `test.js`

#### 3) Pasamos un array 4 de promesas que **algunas fallan y otras no**:

Si algunas promesas no fallan, es como el primer caso. Una vez se encuentre la primera promesa exitosa, dicha promesa será devuelta. Esto es lo que prueba el **sexto** test unitario.

Con lo cual, la implementación de `any` debería ser la que está implementada en index.js:

``` javascript
any: function (arr) {
    return this.inverse(this.all(arr.map(this.inverse)));
}
```

## Explicación lógica matemática:


```
Existe x que cumple P(x)
```
equivale en lógica matemática a: 
```
No para todo x no se cumple P(x)
```

De hecho, puede implementarse el método `Array.prototype.some` con ayuda del método `Array.prototype.every` usando esta regla:
```
var every = Array.prototype.every

Array.prototype.some = function (e) {
	return not(every.call(this.map(not)))
}

// donde not es
function (e) {
	return !e
}
```

Ahora bien, mientras la función inversa para los booleanos es la negación. Para una promesa, la función inversa es aquella que dada una promesa resuelta exitosamente, devuelve una que resuelve fallidamente y, a la inversa, dada una promesa resuelta fallidamente, devuelve una que resuelve exitosamente. 

Con lo cual, simplemente sustituyendo los métodos encontramos la implementación de any.

``` javascript
any: function (arr) {
    return this.inverse(this.all(arr.map(this.inverse)));
}
```

que se puede ver en el fichero `index.js`






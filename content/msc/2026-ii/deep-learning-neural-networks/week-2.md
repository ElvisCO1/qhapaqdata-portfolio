---
week: 2
title: "Getting started"
status: in-progress
published: true
topic: "Optimization, Regularization, CNN Basics & Classic Architectures "
---
### 1.1 Optimización convexa y no convexa

La **optimización** es una parte fundamental del entrenamiento de una red neuronal.

Cuando entrenamos un modelo de Deep Learning, buscamos encontrar los valores de los parámetros del modelo que permitan reducir el error de sus predicciones.

Los parámetros de una red neuronal incluyen principalmente:

- Pesos (*weights*).
- Sesgos (*biases*).

Podemos representar el conjunto de parámetros mediante:

\[
\theta
\]

y la función que mide el error del modelo mediante:

\[
L(\theta)
\]

donde:

- \(L\) representa la función de pérdida (*loss function*).
- \(\theta\) representa los parámetros del modelo.

El objetivo del proceso de entrenamiento puede expresarse como:

\[
\theta^*=\arg\min_{\theta}L(\theta)
\]

Esto significa que buscamos la combinación de parámetros que produzca el menor valor posible de la función de pérdida.

Por ejemplo, supongamos que diferentes configuraciones del modelo producen:

| Parámetros | Pérdida |
|---|---:|
| \(\theta_1\) | 1.80 |
| \(\theta_2\) | 1.20 |
| \(\theta_3\) | 0.65 |
| \(\theta_4\) | 0.22 |

La configuración \(\theta_4\) es mejor que las anteriores porque produce una pérdida menor.

El entrenamiento consiste, de forma simplificada, en modificar progresivamente los parámetros para desplazarse hacia regiones donde la función de pérdida sea menor.

---

#### Funciones convexas

Una **función convexa** presenta una estructura relativamente sencilla desde el punto de vista de la optimización.

Un ejemplo básico es:

\[
f(x)=x^2
\]

Esta función tiene forma parabólica y posee un mínimo claramente definido.

```text
f(x)
 ^
 |          *
 |        *   *
 |      *       *
 |    *           *
 |  *               *
 |_________*____________> x
           ↓
        mínimo
```

El punto mínimo se encuentra en:

\[
x=0
\]

porque:

\[
f(0)=0
\]

Si evaluamos diferentes valores:

| \(x\) | \(f(x)=x^2\) |
|---:|---:|
| -3 | 9 |
| -2 | 4 |
| -1 | 1 |
| 0 | 0 |
| 1 | 1 |
| 2 | 4 |
| 3 | 9 |

Podemos observar que conforme nos acercamos a \(x=0\), el valor de la función disminuye.

Por tanto:

\[
x^*=0
\]

es el mínimo global.

La característica fundamental de una función convexa es que **cualquier mínimo local también es un mínimo global**.

Esto significa que, una vez encontrado un mínimo, no existe otra región de la función con un valor inferior.

Una forma intuitiva de entenderlo es imaginar una pelota dentro de un recipiente:

```text
       \               /
        \             /
         \           /
          \         /
           \       /
            \     /
             \ ● /
              \_/
               ↓
        mínimo global
```

Aunque la pelota comience en diferentes posiciones, tenderá a desplazarse hacia el mismo punto inferior.

Por esta razón, los problemas convexos suelen ser más fáciles de optimizar.

---

#### Funciones no convexas

Una **función no convexa** presenta una estructura mucho más compleja.

Puede contener:

- Varios valles.
- Picos.
- Regiones planas.
- Cambios de curvatura.
- Diferentes regiones con valores bajos de pérdida.

Un ejemplo conceptual sería:

```text
Pérdida
  ^
  |             /\              /\
  |      /\    /  \            /  \
  |     /  \__/    \___       /    \
  | ___/              \______/      \__
  |/
  +--------------------------------------> Parámetros
```

A diferencia de una función convexa, ahora existen diferentes zonas hacia las cuales puede desplazarse el optimizador.

Este comportamiento es mucho más parecido al que se encuentra en una red neuronal profunda.

Una red neuronal combina múltiples operaciones.

Por ejemplo:

\[
z_1=W_1x+b_1
\]

Luego puede aplicarse una función de activación:

\[
h_1=ReLU(z_1)
\]

Después:

\[
z_2=W_2h_1+b_2
\]

y así sucesivamente.

De forma simplificada:

```text
Entrada
   ↓
W₁x + b₁
   ↓
ReLU
   ↓
W₂h + b₂
   ↓
ReLU
   ↓
W₃h + b₃
   ↓
Salida
```

Cuando existen muchas capas, pesos, sesgos y funciones no lineales, la relación entre los parámetros y la pérdida se vuelve muy compleja.

Por ello, las redes neuronales profundas normalmente presentan problemas de optimización **no convexos**.

---

#### Paisaje de pérdida

El **paisaje de pérdida (*loss landscape*)** representa cómo cambia la función de pérdida cuando modificamos los parámetros del modelo.

Si tuviéramos solamente un parámetro \(w\), podríamos representar:

\[
L(w)
\]

de esta manera:

```text
Pérdida
  ^
  |       *
  |     *   *
  |   *       *
  |  *         *
  |_*___________*________> w
```

El eje horizontal representa diferentes valores del parámetro \(w\).

El eje vertical representa la pérdida correspondiente.

Por ejemplo:

| \(w\) | \(L(w)\) |
|---:|---:|
| -2 | 2.50 |
| -1 | 1.20 |
| 0 | 0.40 |
| 1 | 0.75 |
| 2 | 1.90 |

En este ejemplo, un valor cercano a \(w=0\) produce una pérdida menor.

Sin embargo, una red neuronal real posee muchos parámetros:

\[
\theta=(w_1,w_2,w_3,\ldots,w_n,b_1,b_2,\ldots)
\]

Por tanto, realmente tenemos:

\[
L(w_1,w_2,w_3,\ldots,w_n)
\]

Si una red contiene un millón de parámetros, conceptualmente el paisaje de pérdida tendría aproximadamente un millón de dimensiones asociadas a esos parámetros.

No podemos visualizar directamente un espacio de tantas dimensiones.

Por esta razón, las gráficas de dos o tres dimensiones utilizadas en libros o clases son simplificaciones.

La idea fundamental es:

> Cada punto del paisaje de pérdida representa una configuración diferente de los parámetros de la red neuronal.

Por ejemplo:

\[
\theta_A=(w_1,w_2,\ldots,w_n)
\]

podría producir:

\[
L(\theta_A)=1.25
\]

mientras que otra configuración:

\[
\theta_B=(w'_1,w'_2,\ldots,w'_n)
\]

podría producir:

\[
L(\theta_B)=0.18
\]

En este caso, \(\theta_B\) se encuentra en una región más favorable del paisaje de pérdida.

---

#### Mínimo global

El **mínimo global (*global minimum*)** corresponde al punto donde la función de pérdida alcanza el valor más bajo posible dentro de todo el espacio de parámetros.

Matemáticamente:

\[
L(\theta^*)\leq L(\theta)
\]

para cualquier posible configuración \(\theta\).

Visualmente:

```text
Pérdida
  ^
  |        /\                  /\
  |       /  \                /  \
  | _____/    \______________/    \____
  |                  ↓
  |            mínimo global
  +------------------------------------> Parámetros
```

Por ejemplo:

| Región | Pérdida |
|---|---:|
| A | 0.80 |
| B | 0.42 |
| C | 0.15 |
| D | 0.36 |

La región C tiene el menor valor:

\[
L(\theta_C)=0.15
\]

Por tanto, representa el mínimo global entre las configuraciones consideradas.

---

#### Mínimo local

Un **mínimo local (*local minimum*)** es un punto donde la pérdida es menor que en los puntos cercanos, pero no necesariamente es el menor valor de toda la función.

```text
Pérdida
  ^
  |        /\                  /\
  |       /  \____            /  \
  | _____/        \__________/    \____
  |        ↓                  ↓
  |     mínimo            mínimo
  |      local             global
  +------------------------------------> Parámetros
```

Supongamos que una región tiene:

\[
L(\theta_{local})=0.35
\]

y los puntos cercanos tienen pérdidas:

\[
0.42,\;0.48,\;0.51,\;0.40
\]

Entonces \(0.35\) representa un mínimo respecto a su entorno.

Sin embargo, otra región podría tener:

\[
L(\theta_{global})=0.12
\]

Como:

\[
0.12<0.35
\]

el primer punto era únicamente un mínimo local.

La diferencia fundamental es:

| Concepto | Interpretación |
|---|---|
| Mínimo local | Menor que los puntos cercanos |
| Mínimo global | Menor que todos los puntos de la función |

---

#### Comparación entre optimización convexa y no convexa

```text
FUNCIÓN CONVEXA

Pérdida
  ^
  |       \       /
  |        \     /
  |         \   /
  |          \_/
  |           ↓
  |       mínimo global
  +----------------------> Parámetros
```

```text
FUNCIÓN NO CONVEXA

Pérdida
  ^
  |      /\        /\         /\
  |     /  \______/  \       /  \
  | ___/              \_____/
  |      ↓                  ↓
  | mínimo local      mínimo global
  +-------------------------------> Parámetros
```

| Característica | Función convexa | Función no convexa |
|---|---|---|
| Estructura | Relativamente simple | Compleja |
| Mínimos locales | También son globales | Pueden ser diferentes del global |
| Paisaje de pérdida | Más regular | Puede contener varios valles |
| Optimización | Más predecible | Más difícil |
| Redes neuronales profundas | Menos habitual | Muy habitual |

---

#### Dificultades de la optimización en redes neuronales

La optimización de una red neuronal profunda es complicada principalmente por dos razones:

1. La función de pérdida es normalmente no convexa.
2. La cantidad de parámetros puede ser extremadamente grande.

Además, pueden aparecer distintas dificultades durante el entrenamiento.

---

##### 1. Gran cantidad de parámetros

Una red neuronal puede contener millones de parámetros.

Por ejemplo:

\[
\theta=(w_1,w_2,\ldots,w_{10\,000\,000})
\]

Cada parámetro representa una dimensión adicional dentro del espacio de optimización.

Encontrar una buena combinación de valores dentro de un espacio tan grande es mucho más complejo que optimizar una función con una sola variable.

---

##### 2. Mínimos locales

Durante el entrenamiento, el optimizador puede llegar a una región donde la pérdida sea menor que en los puntos cercanos.

```text
Pérdida
  ^
  |      \      /
  |       \____/
  |         ↓
  |    mínimo local
  +--------------------> Parámetros
```

Sin embargo, puede existir otra región con una pérdida todavía menor.

Por ello, encontrar una región de baja pérdida no significa necesariamente haber encontrado el mínimo global.

---

##### 3. Puntos de silla

Un **punto de silla (*saddle point*)** es una región donde el gradiente puede ser cercano a cero sin tratarse realmente de un mínimo.

En una dirección la función puede aumentar mientras que en otra puede disminuir.

```text
              ↑ aumenta

            \     /
             \   /
--------------●--------------
             /   \
            /     \

              ↓ disminuye
```

En espacios de muchas dimensiones pueden aparecer numerosos puntos de este tipo.

Cuando el gradiente es muy pequeño, el optimizador puede avanzar lentamente.

---

##### 4. Regiones planas

También pueden existir zonas donde:

\[
\nabla L(\theta)\approx0
\]

Esto significa que el gradiente es muy pequeño.

```text
Pérdida
  ^
  |
  |       __________________________
  |      /
  |_____/
  +--------------------------------> Parámetros
             región plana
```

Si el gradiente es pequeño, las actualizaciones de los parámetros también pueden ser pequeñas.

Como consecuencia, el entrenamiento puede avanzar lentamente.

---

##### 5. Curvaturas complejas y oscilaciones

El paisaje de pérdida puede ser muy pronunciado en una dirección y relativamente plano en otra.

```text
        \          /
         \        /
          \      /
           \    /
            \  /
             \/
             ↓
```

En este tipo de regiones, el optimizador podría oscilar entre ambos lados:

```text
\ ●
 \   ●
  ●
   \   ●
    ●
     \________
```

en lugar de avanzar directamente hacia una región de menor pérdida.

Este problema ayuda a comprender posteriormente la utilidad de algoritmos como:

- Momentum.
- RMSProp.
- Adam.

---

##### 6. Elección de la tasa de aprendizaje

La **tasa de aprendizaje (*learning rate*)** determina el tamaño de cada actualización de los parámetros.

La regla básica del descenso de gradiente es:

\[
\theta_{t+1}
=
\theta_t-\eta\nabla L(\theta_t)
\]

donde:

- \(\theta_t\) representa los parámetros actuales.
- \(\eta\) representa la tasa de aprendizaje.
- \(\nabla L(\theta_t)\) representa el gradiente.

Una tasa de aprendizaje pequeña puede producir:

```text
● → ● → ● → ● → ● → ● → mínimo
```

Los pasos son pequeños y el entrenamiento puede ser estable, pero lento.

Una tasa adecuada puede producir:

```text
● ----→ ● ----→ ● ----→ mínimo
```

El modelo puede avanzar rápidamente manteniendo estabilidad.

Una tasa demasiado grande puede provocar:

```text
       mínimo
         ↓
\       / \
 \ ● → /   \ ← ●
  \   /     \
```

El algoritmo puede sobrepasar repetidamente la región de menor pérdida.

Esto puede producir:

- Oscilaciones.
- Inestabilidad.
- Divergencia.

---

#### El papel del gradiente

El **gradiente** indica cómo cambia la función de pérdida cuando modificamos los parámetros.

Se representa como:

\[
\nabla L(\theta)
\]

El gradiente apunta hacia la dirección de mayor incremento de la función.

Por ello, si queremos reducir la pérdida debemos desplazarnos en la dirección contraria:

\[
-\nabla L(\theta)
\]

La regla de actualización del descenso de gradiente es:

\[
\boxed{
\theta_{t+1}
=
\theta_t-\eta\nabla L(\theta_t)
}
\]

Podemos imaginar el proceso de entrenamiento como descender por una montaña:

```text
Pérdida
  ^
  | ●
  |   \
  |     ●
  |       \
  |         ●
  |           \
  |             ●
  |               \____
  +--------------------------> Parámetros
```

Cada punto representa una nueva configuración de parámetros.

Idealmente, la pérdida disminuye progresivamente.

---

#### Ejemplo conceptual de entrenamiento

Supongamos que una red comienza con parámetros aleatorios:

\[
\theta_0
\]

y produce una pérdida inicial de:

\[
L(\theta_0)=1.80
\]

Después de calcular el gradiente:

\[
\nabla L(\theta_0)
\]

se actualizan los parámetros:

\[
\theta_1=
\theta_0-\eta\nabla L(\theta_0)
\]

La nueva pérdida podría ser:

\[
L(\theta_1)=1.25
\]

Después:

\[
L(\theta_2)=0.82
\]

Luego:

\[
L(\theta_3)=0.46
\]

y posteriormente:

\[
L(\theta_4)=0.23
\]

Conceptualmente:

```text
Parámetros       Pérdida

θ₀                 1.80
 ↓
θ₁                 1.25
 ↓
θ₂                 0.82
 ↓
θ₃                 0.46
 ↓
θ₄                 0.23
```

El proceso continúa hasta encontrar una región donde la pérdida sea suficientemente baja o hasta cumplir algún criterio de finalización.

---

#### ¿Es necesario encontrar siempre el mínimo global?

No necesariamente.

En Deep Learning, el objetivo práctico no consiste solamente en obtener la menor pérdida posible sobre los datos de entrenamiento.

También buscamos que el modelo funcione correctamente sobre datos que nunca ha visto.

Esta propiedad se denomina **generalización (*generalization*)**.

Por ejemplo:

| Modelo | Pérdida de entrenamiento | Pérdida de validación |
|---|---:|---:|
| A | 0.001 | 0.40 |
| B | 0.020 | 0.05 |

El modelo A tiene una pérdida de entrenamiento menor.

Sin embargo, el modelo B tiene una pérdida de validación mucho menor.

Por tanto, el modelo B probablemente generaliza mejor.

Esto demuestra que:

> Encontrar una pérdida extremadamente baja durante el entrenamiento no garantiza automáticamente que el modelo sea mejor.

Este concepto se relacionará posteriormente con:

- Overfitting.
- Regularización.
- Dropout.
- Weight decay.
- Data augmentation.

---

#### Relación con los algoritmos de optimización

Debido a la complejidad de los paisajes de pérdida no convexos, existen diferentes algoritmos para actualizar los parámetros de una red neuronal.

Entre ellos:

- Descenso de gradiente.
- SGD.
- Momentum.
- RMSProp.
- Adam.

Todos intentan resolver esencialmente el mismo problema:

\[
\min_{\theta}L(\theta)
\]

La diferencia entre ellos se encuentra principalmente en **cómo utilizan el gradiente y la información de actualizaciones anteriores para recorrer el paisaje de pérdida**.

---

#### Idea principal

El entrenamiento de una red neuronal puede entenderse como un problema de optimización.

Buscamos:

\[
\theta^*
=
\arg\min_{\theta}L(\theta)
\]

En una función convexa, cualquier mínimo local también corresponde a un mínimo global.

En Deep Learning, las funciones de pérdida suelen ser no convexas debido a la combinación de:

- Muchas capas.
- Grandes cantidades de parámetros.
- Pesos y sesgos.
- Funciones de activación no lineales.

Como consecuencia, el paisaje de pérdida puede contener:

- Diferentes regiones de baja pérdida.
- Mínimos locales.
- Puntos de silla.
- Regiones planas.
- Curvaturas complejas.

Los algoritmos de optimización utilizan información del gradiente para desplazarse por este paisaje y encontrar configuraciones de parámetros que produzcan una pérdida suficientemente baja.

El objetivo práctico no siempre es encontrar matemáticamente el mínimo global exacto, sino encontrar una solución que permita que el modelo aprenda correctamente y **generalice bien sobre datos nuevos**.

---

#### Conceptos clave

| Español | Inglés |
|---|---|
| Optimización | Optimization |
| Función convexa | Convex function |
| Función no convexa | Non-convex function |
| Función de pérdida | Loss function |
| Paisaje de pérdida | Loss landscape |
| Mínimo global | Global minimum |
| Mínimo local | Local minimum |
| Punto de silla | Saddle point |
| Región plana | Flat region |
| Gradiente | Gradient |
| Parámetros | Parameters |
| Pesos | Weights |
| Sesgo | Bias |
| Tasa de aprendizaje | Learning rate |
| Generalización | Generalization |

---

#### Lo que debo recordar

1. Entrenar una red neuronal es un problema de optimización.

2. El objetivo consiste en encontrar parámetros que reduzcan la función de pérdida:

\[
\theta^*=\arg\min_{\theta}L(\theta)
\]

3. En una función convexa, cualquier mínimo local también es un mínimo global.

4. Las redes neuronales profundas normalmente presentan funciones de pérdida no convexas.

5. El paisaje de pérdida representa cómo cambia el error cuando modificamos los parámetros del modelo.

6. El mínimo global representa el menor valor de toda la función.

7. Un mínimo local representa un valor inferior solamente respecto a los puntos cercanos.

8. Las redes neuronales profundas pueden presentar regiones planas, puntos de silla y curvaturas complejas.

9. El gradiente indica cómo cambia la pérdida y permite determinar cómo actualizar los parámetros.

10. La tasa de aprendizaje controla el tamaño de cada actualización.

11. Los optimizadores como SGD, Momentum, RMSProp y Adam buscan recorrer eficientemente el paisaje de pérdida.

12. En la práctica, no siempre es necesario encontrar exactamente el mínimo global; es más importante encontrar una solución con baja pérdida y buena capacidad de generalización.
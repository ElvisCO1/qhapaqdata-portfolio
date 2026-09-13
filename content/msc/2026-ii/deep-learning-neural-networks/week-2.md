---
week: 2
title: "Getting started"
status: in-progress
published: true
topic: "Optimization, Regularization, CNN Basics & Classic Architectures "
---

# 1. Optimización de redes neuronales

La **optimización** es el proceso mediante el cual una red neuronal modifica sus parámetros para reducir el error de sus predicciones durante el entrenamiento.

Los parámetros aprendidos por una red incluyen principalmente los **pesos (*weights*)** y los **sesgos (*biases*)**. Podemos representar el conjunto completo de parámetros mediante:

$$
\theta
$$

y la función que mide el error mediante:

$$
L(\theta)
$$

El objetivo del entrenamiento consiste en encontrar una configuración de parámetros que produzca una pérdida pequeña:

$$
\theta^* = \arg\min_{\theta} L(\theta)
$$

De manera conceptual, el proceso puede verse como:

```text
Datos
  ↓
Red neuronal
  ↓
Predicción
  ↓
Cálculo de la pérdida
  ↓
Gradiente
  ↓
Actualización de pesos
  ↓
Nueva predicción
```

Este ciclo se repite durante el entrenamiento hasta alcanzar una solución adecuada.

---

## 1.1 Optimización convexa y no convexa

Para comprender por qué entrenar una red neuronal puede ser difícil, primero es necesario distinguir entre funciones **convexas** y **no convexas**.

### Función convexa

Una función convexa presenta un paisaje relativamente sencillo.

Un ejemplo básico es:

$$
f(x)=x^2
$$

```text
Pérdida
  ^
  |       \       /
  |        \     /
  |         \   /
  |          \_/
  |           ↓
  |     mínimo global
  +--------------------> Parámetro
```

Su punto mínimo se encuentra en:

$$
x=0
$$

porque:

$$
f(0)=0
$$

Por ejemplo:

| $x$ | $f(x)=x^2$ |
|---:|---:|
| -2 | 4 |
| -1 | 1 |
| 0 | 0 |
| 1 | 1 |
| 2 | 4 |

En una función convexa, cualquier mínimo local también corresponde a un mínimo global.

Esto facilita el proceso de optimización porque existe una estructura más predecible para encontrar la región de menor pérdida.

---

### Función no convexa

Una función no convexa puede contener varios valles, picos y regiones con diferentes valores de pérdida.

```text
Pérdida
  ^
  |        /\              /\
  |       /  \____        /  \
  | _____/        \______/    \____
  |         ↓             ↓
  |      mínimo        mínimo
  |       local         global
  +--------------------------------> Parámetros
```

Las redes neuronales profundas trabajan normalmente con funciones de pérdida **no convexas**.

Esto ocurre porque una red combina muchas capas, parámetros y funciones no lineales.

Por ejemplo:

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
Salida
   ↓
Loss
```

Como resultado, el problema de optimización puede presentar múltiples regiones posibles hacia las cuales desplazarse.

---

### Paisaje de pérdida

El **paisaje de pérdida (*loss landscape*)** describe cómo cambia la pérdida cuando modificamos los parámetros de la red.

Con un solo parámetro podríamos representar:

$$
L(w)
$$

pero una red neuronal real tiene muchos:

$$
L(w_1,w_2,w_3,\ldots,w_n)
$$

Por ejemplo, dos configuraciones diferentes podrían producir:

$$
L(\theta_A)=1.2
$$

y:

$$
L(\theta_B)=0.25
$$

En este caso, $\theta_B$ se encuentra en una región más favorable del paisaje porque produce una menor pérdida.

Cada punto del paisaje representa una configuración diferente de pesos y sesgos.

El entrenamiento consiste, conceptualmente, en desplazarse por ese paisaje buscando regiones con menor pérdida.

---

### Mínimo global y mínimo local

El **mínimo global** es el punto con el menor valor de pérdida de toda la función.

$$
L(\theta^*) \leq L(\theta)
$$

para cualquier configuración posible de parámetros.

Un **mínimo local**, en cambio, solamente tiene una pérdida menor que los puntos que se encuentran alrededor de él.

```text
Pérdida
  ^
  |        /\                /\
  |       /  \___           /  \
  | _____/       \_________/    \____
  |        ↓             ↓
  |      local         global
  +----------------------------------> Parámetros
```

Por ejemplo:

$$
L(\theta_{local})=0.40
$$

pero podría existir otra región donde:

$$
L(\theta_{global})=0.15
$$

Entonces:

$$
0.15 < 0.40
$$

y el primer punto solamente representa un mínimo local.

En la práctica, el entrenamiento de una red profunda no requiere necesariamente encontrar matemáticamente el mínimo global exacto. Lo importante es encontrar una configuración con una pérdida suficientemente baja y una buena capacidad de generalización.

---

## 1.2 Gradiente y descenso de gradiente

Una vez definida la función de pérdida, necesitamos determinar **en qué dirección deben cambiar los parámetros para reducirla**.

Para ello utilizamos el **gradiente**:

$$
\nabla L(\theta)
$$

El gradiente indica la dirección en la que la función aumenta con mayor rapidez.

Por lo tanto, para disminuir la pérdida debemos movernos en la dirección contraria:

$$
-\nabla L(\theta)
$$

La actualización básica de los parámetros es:

$$
\theta_{t+1}
=
\theta_t-\eta\nabla L(\theta_t)
$$

donde:

- $\theta_t$: parámetros actuales.
- $\theta_{t+1}$: parámetros después de la actualización.
- $\nabla L(\theta_t)$: gradiente de la pérdida.
- $\eta$: tasa de aprendizaje (*learning rate*).

Conceptualmente:

```text
Pérdida
  ^
  | ●  θ₀
  |  \
  |   ● θ₁
  |     \
  |      ● θ₂
  |        \
  |         ● θ₃
  |           \____
  +----------------------> Parámetros
```

En cada actualización intentamos mover los parámetros hacia una región de menor pérdida.

---

### Tasa de aprendizaje

La **tasa de aprendizaje** $\eta$ determina el tamaño de cada paso.

#### Tasa pequeña

```text
● → ● → ● → ● → ● → ● → mínimo
```

Produce pasos pequeños.

Puede ser estable, pero el entrenamiento puede resultar lento.

#### Tasa adecuada

```text
● ----→ ● ----→ ● ----→ mínimo
```

Permite avanzar más rápidamente manteniendo estabilidad.

#### Tasa demasiado grande

```text
          mínimo
            ↓
       \         /
    ● → \       / ← ●
         \_____/
```

Puede hacer que el optimizador sobrepase repetidamente la región de menor pérdida.

Esto puede producir:

- Oscilaciones.
- Inestabilidad.
- Divergencia.

---

## 1.3 SGD, Mini-Batch y Full Batch

Una diferencia importante entre los métodos de descenso de gradiente consiste en **cuántas observaciones se utilizan para calcular cada actualización**.

Si tenemos un conjunto de datos con $N$ observaciones, podemos utilizar una sola observación, un pequeño grupo o todo el dataset.

---

### Stochastic Gradient Descent — SGD

En **SGD**, cada actualización puede calcularse utilizando una sola observación:

$$
\theta_{t+1}
=
\theta_t-\eta\nabla L_i(\theta_t)
$$

donde $L_i$ corresponde a la pérdida asociada a una observación.

Conceptualmente:

```text
Dataset
  ↓
1 muestra
  ↓
Gradiente
  ↓
Actualización
```

Características:

- Actualizaciones frecuentes.
- Bajo costo por actualización.
- Trayectoria más ruidosa.
- Puede presentar mayor variabilidad durante la convergencia.

Visualmente, el recorrido puede ser irregular:

```text
       ·
      / \
  ·--/   \_
          \ ·
            \_
              ● mínimo
```

Ese ruido no significa necesariamente que el algoritmo esté funcionando mal; aparece porque cada muestra proporciona una estimación diferente del gradiente.

---

### Full Batch Gradient Descent

En **Full Batch**, el gradiente se calcula utilizando todo el conjunto de entrenamiento antes de realizar una actualización.

$$
\nabla L
=
\frac{1}{N}
\sum_{i=1}^{N}
\nabla L_i
$$

Conceptualmente:

```text
Dataset completo
       ↓
Todos los ejemplos
       ↓
Gradiente promedio
       ↓
Actualización
```

Ventajas:

- Gradiente más estable.
- Menor ruido entre actualizaciones.

Desventajas:

- Mayor costo computacional.
- Cada actualización necesita procesar todo el dataset.

Si tuviéramos:

$$
N=1\,000\,000
$$

sería necesario procesar un millón de observaciones para realizar una única actualización.

---

### Mini-Batch Gradient Descent

El **Mini-Batch Gradient Descent** utiliza un grupo pequeño de observaciones para calcular cada actualización.

Por ejemplo:

$$
B=32,\;64,\;128
$$

Conceptualmente:

```text
Dataset
   ↓
Mini-batch de 32 muestras
   ↓
Gradiente
   ↓
Actualización
   ↓
Siguiente mini-batch
```

El mini-batch representa un punto intermedio entre SGD y Full Batch.

| Método | Datos por actualización | Ruido | Costo por actualización |
|---|---:|---|---|
| SGD | 1 | Alto | Bajo |
| Mini-batch | 32, 64, 128... | Medio | Medio |
| Full Batch | Todo el dataset | Bajo | Alto |

En Deep Learning, el enfoque mini-batch es especialmente útil porque permite aprovechar eficientemente el procesamiento paralelo de GPU.

---

## 1.4 Momentum

**Momentum** se introduce como una extensión del descenso de gradiente que utiliza información de actualizaciones anteriores.

La idea intuitiva puede compararse con una pelota descendiendo por una pendiente: a medida que continúa avanzando en una dirección, acumula velocidad.

En lugar de considerar únicamente el gradiente actual, Momentum incorpora parte de la dirección previa.

Conceptualmente:

```text
Sin Momentum

\ ●
 \   ●
  ●
   \   ●
    ●
     \______


Con Momentum

\ ●
 \    ●
  \       ●
   \           ●
    \____________●
```

El objetivo es reducir oscilaciones y favorecer un desplazamiento más consistente hacia regiones de menor pérdida.

En el material de esta sesión, **Momentum aparece incluido dentro del bloque de optimización**, pero no se desarrolla con el mismo nivel matemático que RMSProp.

---

## 1.5 RMSProp

**RMSProp** es un algoritmo de optimización adaptativo.

Su objetivo es ajustar el tamaño de las actualizaciones de manera individual para cada parámetro utilizando información de los gradientes recientes.

En lugar de acumular indefinidamente todos los gradientes anteriores, RMSProp mantiene una **media móvil de los gradientes cuadrados**.

Se calcula:

$$
v_t
=
\beta v_{t-1}
+
(1-\beta)g_t^2
$$

donde:

- $g_t$: gradiente actual.
- $v_t$: media móvil de los gradientes cuadrados.
- $\beta$: factor de decaimiento.

Después, el parámetro se actualiza mediante:

$$
\theta_{t+1}
=
\theta_t
-
\frac{\eta}
{\sqrt{v_t}+\epsilon}
g_t
$$

donde:

- $\eta$: tasa de aprendizaje.
- $\epsilon$: valor pequeño que evita una división entre cero.
- $\theta_t$: parámetro actual.

La idea central es:

```text
Gradiente actual
      ↓
Elevar al cuadrado
      ↓
Media móvil
      ↓
Normalización de la actualización
      ↓
Actualización del parámetro
```

Si un parámetro presenta gradientes grandes, el denominador aumenta y su actualización se reduce.

Si los gradientes son menores, el ajuste puede ser relativamente mayor.

De esta manera, RMSProp adapta las actualizaciones individualmente.

---

### ¿Por qué utilizar RMSProp?

El material compara RMSProp principalmente con SGD y Adagrad.

SGD puede utilizar una tasa de aprendizaje constante, mientras que Adagrad acumula gradientes cuadrados y puede hacer que la tasa efectiva disminuya demasiado con el tiempo.

RMSProp busca evitar este problema utilizando solamente una media móvil de gradientes recientes.

Esto permite mantener un equilibrio entre:

- Velocidad de convergencia.
- Estabilidad.
- Adaptación del tamaño de las actualizaciones.

---

### Parámetros importantes de RMSProp

#### Learning Rate — $\eta$

Controla el tamaño base de las actualizaciones.

Ejemplo:

```python
optimizer = optim.RMSprop(
    model.parameters(),
    lr=0.001
)
```

Aunque RMSProp adapta las actualizaciones, el valor de `lr` continúa siendo importante.

Un `learning rate` excesivamente grande puede producir inestabilidad.

---

#### Decay Rate — $\beta$

Determina cuánto peso tienen los gradientes anteriores en la media móvil:

$$
v_t
=
\beta v_{t-1}
+
(1-\beta)g_t^2
$$

Un valor típico presentado en el material es cercano a:

$$
\beta=0.9
$$

---

#### Epsilon — $\epsilon$

Se utiliza para evitar divisiones entre cero y mejorar la estabilidad numérica.

Por ejemplo:

$$
\epsilon=10^{-8}
$$

---

### Experimento realizado con RMSProp

Una de las actividades de la sesión consiste en crear una red neuronal sencilla con:

```text
10 características de entrada
        ↓
Dense 64
        ↓
ReLU
        ↓
1 salida
```

y entrenarla utilizando RMSProp.

La actividad también propone modificar la tasa de aprendizaje y observar cómo cambia la pérdida.

Ejemplo:

```python
import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Sequential(
    nn.Linear(10, 64),
    nn.ReLU(),
    nn.Linear(64, 1)
)

optimizer = optim.RMSprop(
    model.parameters(),
    lr=0.001
)

criterion = nn.MSELoss()

for epoch in range(20):
    optimizer.zero_grad()

    output = model(X)
    loss = criterion(output, y)

    loss.backward()
    optimizer.step()

    print(f"Epoch {epoch+1}: Loss = {loss.item():.4f}")
```

El propósito del experimento es observar cómo la tasa de aprendizaje afecta:

- La rapidez con la que disminuye la pérdida.
- La estabilidad del entrenamiento.
- La posibilidad de oscilación o divergencia.

---

## 1.6 Adam

**Adam** aparece en el contenido general de optimización de la sesión junto con SGD, Momentum y RMSProp.

En esta presentación no recibe el mismo desarrollo detallado que RMSProp, por lo que se mantiene aquí como concepto introductorio dentro del mapa de optimizadores revisados.

Conceptualmente, Adam pertenece a la familia de **optimizadores adaptativos**, es decir, métodos que ajustan la actualización de los parámetros utilizando información acumulada durante el entrenamiento.

Dentro de la secuencia de esta semana puede entenderse como:

```text
Gradient Descent
       ↓
      SGD
       ↓
   Momentum
       ↓
Métodos adaptativos
       ↓
 ┌───────────────┐
 │ Adagrad       │
 │ RMSProp       │
 │ Adam          │
 └───────────────┘
```

RMSProp es el optimizador que se desarrolla con mayor profundidad y con actividades prácticas dentro de este bloque.

---

## Comparación general de los métodos revisados

| Método | Idea principal | Comportamiento |
|---|---|---|
| SGD | Utiliza una muestra por actualización | Rápido, pero ruidoso |
| Mini-batch | Utiliza pequeños grupos de datos | Equilibrio entre eficiencia y estabilidad |
| Full Batch | Utiliza todo el dataset | Estable, pero costoso |
| Momentum | Incorpora información de actualizaciones anteriores | Reduce oscilaciones |
| RMSProp | Adapta las actualizaciones mediante gradientes cuadrados recientes | Adaptativo y estable |
| Adam | Optimizador adaptativo | Introducido como parte de los métodos modernos |

---

## Flujo conceptual de la optimización

Los conceptos revisados pueden conectarse de la siguiente manera:

```text
Red neuronal
     ↓
Predicción
     ↓
Función de pérdida L(θ)
     ↓
Gradiente ∇L(θ)
     ↓
Algoritmo de optimización
     │
     ├── SGD
     ├── Mini-batch
     ├── Momentum
     ├── RMSProp
     └── Adam
     ↓
Actualización de parámetros
     ↓
Nueva predicción
     ↓
Menor pérdida
```

---

## Ideas principales

- Entrenar una red neuronal puede formularse como un problema de optimización.
- Las redes neuronales profundas presentan generalmente funciones de pérdida no convexas.
- El paisaje de pérdida representa cómo cambia el error al modificar los parámetros.
- El gradiente proporciona información sobre cómo cambia la pérdida.
- El descenso de gradiente actualiza los parámetros en la dirección opuesta al gradiente.
- La tasa de aprendizaje controla el tamaño de cada actualización.
- SGD utiliza actualizaciones muy frecuentes y presenta mayor ruido.
- Full Batch utiliza todo el dataset y produce actualizaciones más estables pero costosas.
- Mini-batch ofrece un equilibrio entre ambos métodos.
- Momentum busca reducir las oscilaciones utilizando información de actualizaciones anteriores.
- RMSProp adapta el tamaño de las actualizaciones mediante una media móvil de los gradientes cuadrados.
- El `learning rate` continúa siendo importante incluso cuando se utiliza RMSProp.
- Adam forma parte de los optimizadores adaptativos introducidos en la sesión.
- El objetivo práctico es encontrar una región de baja pérdida que permita que el modelo aprenda adecuadamente.

---

## Conceptos clave

| Español | Inglés |
|---|---|
| Optimización | Optimization |
| Función de pérdida | Loss function |
| Función convexa | Convex function |
| Función no convexa | Non-convex function |
| Paisaje de pérdida | Loss landscape |
| Mínimo local | Local minimum |
| Mínimo global | Global minimum |
| Gradiente | Gradient |
| Descenso de gradiente | Gradient descent |
| Tasa de aprendizaje | Learning rate |
| Descenso de gradiente estocástico | Stochastic Gradient Descent |
| Mini-lote | Mini-batch |
| Lote completo | Full batch |
| Momentum | Momentum |
| Media móvil | Moving average |
| RMSProp | RMSProp |
| Optimizador adaptativo | Adaptive optimizer |
| Convergencia | Convergence |
| Oscilación | Oscillation |
| Divergencia | Divergence |
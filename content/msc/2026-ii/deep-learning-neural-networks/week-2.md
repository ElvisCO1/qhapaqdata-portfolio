---
week: 2
title: "Getting started"
status: in-progress
published: true
topic: "Optimization, Regularization, CNN Basics & Classic Architectures "
---


# Semana 2 — Optimización, regularización y fundamentos de CNN

Durante esta semana se estudiaron cuatro áreas principales del Deep Learning:

1. Optimización de redes neuronales.
2. Regularización y generalización.
3. Fundamentos de redes neuronales convolucionales.
4. Arquitecturas y técnicas complementarias.

El objetivo de la sesión fue comprender cómo se entrenan las redes neuronales, cómo se actualizan sus parámetros, cómo se controla el sobreajuste y cómo las CNN extraen características espaciales de las imágenes.

---

# 1. Optimización de redes neuronales

La **optimización** es el proceso mediante el cual una red neuronal modifica sus parámetros para reducir el error producido durante el entrenamiento.

Los parámetros del modelo incluyen principalmente:

- Pesos (*weights*).
- Sesgos (*biases*).

Podemos representar todos los parámetros mediante $\theta$ y la función de pérdida mediante $L(\theta)$.

El objetivo general del entrenamiento es:

$$
\theta^* = \arg\min_{\theta} L(\theta)
$$

Esto significa que buscamos una combinación de parámetros que produzca una pérdida suficientemente baja.

---

## 1.1 Optimización convexa y no convexa

Una **función convexa** presenta una estructura relativamente sencilla.

Un ejemplo básico es:

$$
f(x)=x^2
$$

Su mínimo se encuentra en $x=0$.

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

En una función convexa, cualquier mínimo local también corresponde a un mínimo global.

Una **función no convexa**, en cambio, puede contener múltiples regiones de pérdida baja.

```text
Pérdida
  ^
  |       /\              /\
  |      /  \____        /  \
  | ____/        \______/    \____
  |        ↓               ↓
  |      local           global
  +--------------------------------> Parámetros
```

Las redes neuronales profundas presentan normalmente problemas de optimización no convexos debido a la combinación de:

- Muchas capas.
- Gran cantidad de parámetros.
- Funciones de activación no lineales.

El **paisaje de pérdida (*loss landscape*)** representa cómo cambia la pérdida cuando cambian los parámetros.

En una red real podríamos tener:

$$
L(w_1,w_2,w_3,\ldots,w_n)
$$

Cada punto del paisaje corresponde a una configuración distinta de los pesos.

Un **mínimo local** es menor que los puntos cercanos.

Un **mínimo global** es el menor valor de toda la función.

En Deep Learning no siempre es necesario encontrar exactamente el mínimo global; en la práctica interesa encontrar una solución con baja pérdida y buena capacidad de generalización.

---

## 1.2 Gradiente y descenso de gradiente

El **gradiente** indica cómo cambia la función de pérdida cuando modificamos los parámetros.

Se representa como:

$$
\nabla L(\theta)
$$

El gradiente apunta hacia la dirección de mayor incremento de la función.

Para reducir la pérdida nos desplazamos en la dirección opuesta:

$$
-\nabla L(\theta)
$$

La actualización básica del descenso de gradiente es:

$$
\theta_{t+1}
=
\theta_t
-
\eta \nabla L(\theta_t)
$$

donde:

- $\theta_t$: parámetros actuales.
- $\theta_{t+1}$: nuevos parámetros.
- $\eta$: tasa de aprendizaje.
- $\nabla L(\theta_t)$: gradiente de la pérdida.

Conceptualmente:

```text
Pérdida
  ^
  | ●
  |   \
  |     ●
  |       \
  |         ●
  |           \
  |             ●____
  +------------------------> Parámetros
```

Cada actualización intenta desplazar el modelo hacia una región con menor pérdida.

---

## 1.3 Tasa de aprendizaje

La **tasa de aprendizaje (*learning rate*)** controla el tamaño de los pasos utilizados durante la optimización.

### Tasa pequeña

```text
● → ● → ● → ● → ● → mínimo
```

Puede producir un entrenamiento estable, pero lento.

### Tasa adecuada

```text
● ----→ ● ----→ ● ----→ mínimo
```

Permite avanzar de forma relativamente rápida y estable.

### Tasa demasiado grande

```text
       mínimo
         ↓
\       / \
 \ ● → /   \ ← ●
  \   /     \
```

Puede provocar:

- Oscilaciones.
- Inestabilidad.
- Divergencia.

---

## 1.4 SGD, Mini-Batch y Full Batch

La diferencia principal entre estos métodos consiste en cuántas observaciones se utilizan para calcular cada actualización.

### Stochastic Gradient Descent — SGD

SGD puede utilizar una única observación por actualización.

```text
1 observación
     ↓
Gradiente
     ↓
Actualización
```

Características:

- Actualizaciones frecuentes.
- Bajo costo por actualización.
- Mayor ruido.

---

### Full Batch

Utiliza todo el dataset antes de actualizar los parámetros.

$$
\nabla L
=
\frac{1}{N}
\sum_{i=1}^{N}\nabla L_i
$$

```text
Dataset completo
      ↓
Gradiente promedio
      ↓
Actualización
```

Produce actualizaciones más estables, pero puede ser costoso con datasets grandes.

---

### Mini-Batch

Utiliza pequeños grupos de observaciones.

Ejemplos habituales:

$$
B=32,\quad64,\quad128
$$

```text
Dataset
   ↓
Mini-batch
   ↓
Gradiente
   ↓
Actualización
   ↓
Siguiente mini-batch
```

| Método | Datos por actualización | Ruido | Costo |
|---|---:|---|---|
| SGD | 1 | Alto | Bajo |
| Mini-Batch | Pequeño grupo | Medio | Medio |
| Full Batch | Dataset completo | Bajo | Alto |

Mini-batch es ampliamente utilizado en Deep Learning porque ofrece un buen equilibrio entre eficiencia y estabilidad.

---

## 1.5 Momentum

**Momentum** utiliza información de actualizaciones anteriores para conseguir un movimiento más consistente durante la optimización.

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
 \     ●
  \        ●
   \            ●
    \____________●
```

Momentum ayuda principalmente a:

- Reducir oscilaciones.
- Mantener una dirección de avance.
- Acelerar el entrenamiento en determinadas regiones.

---

## 1.6 RMSProp

**RMSProp** es un optimizador adaptativo que utiliza una media móvil de los gradientes cuadrados.

La media móvil puede representarse como:

$$
v_t
=
\beta v_{t-1}
+
(1-\beta)g_t^2
$$

Luego los parámetros se actualizan mediante:

$$
\theta_{t+1}
=
\theta_t
-
\frac{\eta}{\sqrt{v_t}+\epsilon}g_t
$$

donde:

- $g_t$: gradiente actual.
- $v_t$: media móvil de los gradientes cuadrados.
- $\beta$: factor de decaimiento.
- $\eta$: learning rate.
- $\epsilon$: término de estabilidad numérica.

Conceptualmente:

```text
Gradiente
   ↓
Gradiente²
   ↓
Media móvil
   ↓
Normalización
   ↓
Actualización adaptativa
```

RMSProp adapta el tamaño de las actualizaciones para cada parámetro basándose en el comportamiento reciente de sus gradientes.

El learning rate continúa siendo importante incluso utilizando RMSProp.

---

## 1.7 Adam

**Adam** pertenece a la familia de optimizadores adaptativos.

Combina información relacionada con:

- Dirección promedio de los gradientes.
- Magnitud reciente de los gradientes.

Conceptualmente:

```text
Gradient Descent
       ↓
      SGD
       ↓
   Momentum
       ↓
Métodos adaptativos
       ↓
   RMSProp / Adam
```

El objetivo continúa siendo el mismo:

$$
\min_{\theta} L(\theta)
$$

Lo que cambia entre los optimizadores es la forma de actualizar los parámetros.

---

# 2. Regularización y generalización

La **generalización** es la capacidad del modelo para funcionar correctamente con datos que no fueron utilizados durante su entrenamiento.

Un buen modelo no debe limitarse a memorizar los ejemplos conocidos.

---

## 2.1 Underfitting

El **underfitting o subajuste** ocurre cuando el modelo no aprende suficientemente los patrones presentes en los datos.

```text
Modelo demasiado simple
        ↓
No aprende suficientemente
        ↓
Training: malo
Validation: malo
```

Por ejemplo:

| Dataset | Accuracy |
|---|---:|
| Training | 65 % |
| Validation | 62 % |

---

## 2.2 Overfitting

El **overfitting o sobreajuste** aparece cuando el modelo aprende excesivamente los datos de entrenamiento.

```text
Modelo muy complejo
      ↓
Patrones + ruido
      ↓
Training: excelente
Validation: peor
```

Por ejemplo:

| Dataset | Accuracy |
|---|---:|
| Training | 99 % |
| Validation | 78 % |

Una señal típica es:

```text
Training Loss
↓ ↓ ↓ ↓ ↓

Validation Loss
↓ ↓ ↓ ↑ ↑
```

El modelo continúa mejorando en entrenamiento mientras empeora sobre datos de validación.

---

## 2.3 Bias y Variance

Un modelo con **bias alto** suele ser demasiado simple:

```text
High Bias
   ↓
Underfitting
```

Un modelo con **variance alta** puede ser excesivamente sensible a los datos de entrenamiento:

```text
High Variance
      ↓
Overfitting
```

El objetivo es encontrar un equilibrio:

```text
Modelo simple                     Modelo complejo

High Bias        ← equilibrio →       High Variance

Underfitting                          Overfitting
```

---

## 2.4 Regularización

La regularización agrega una penalización a la función objetivo.

$$
L_{total}
=
L_{original}
+
\lambda R(\theta)
$$

donde $\lambda$ controla la intensidad de la regularización.

---

## 2.5 Regularización L1

L1 penaliza el valor absoluto de los pesos:

$$
L_{total}
=
L_{original}
+
\lambda
\sum_i |w_i|
$$

Puede llevar algunos pesos a cero.

```text
Antes

2.5   0.8   0.05   1.7   0.02

Después de L1

2.1   0.4   0      1.3   0
```

Por ello, L1 favorece la **esparsidad (*sparsity*)**.

---

## 2.6 Regularización L2

L2 penaliza el cuadrado de los pesos:

$$
L_{total}
=
L_{original}
+
\lambda
\sum_i w_i^2
$$

Normalmente reduce su magnitud sin llevarlos exactamente a cero.

```text
Antes

3.0   1.8   0.8   2.5

Después de L2

1.9   1.1   0.5   1.6
```

---

## 2.7 Elastic Net

Elastic Net combina L1 y L2.

$$
L_{total}
=
L_{original}
+
\lambda
\left[
(1-\alpha)\sum_i |w_i|
+
\alpha\sum_i w_i^2
\right]
$$

Conceptualmente:

```text
L1 ─────┐
        ├──→ Elastic Net
L2 ─────┘
```

---

## 2.8 Weight Decay

**Weight decay** busca evitar que los pesos alcancen magnitudes excesivamente grandes.

Conceptualmente:

```text
Peso grande
   ↓
Penalización
   ↓
Peso reducido
```

Puede relacionarse con regularización L2 y también aparece en métodos modernos como AdamW.

---

## 2.9 Dropout

**Dropout** desactiva aleatoriamente una proporción de neuronas durante el entrenamiento.

```text
Red original

● ● ● ● ●
● ● ● ●
  ● ●


Con Dropout

● X ● ● X
● ● X ●
  ● ●
```

En cada iteración se genera una máscara diferente.

Las neuronas no desaparecen permanentemente.

Dropout reduce la **co-adaptación**, evitando que determinadas neuronas dependan demasiado de otras.

---

### Inverted Dropout

Si $p$ representa la probabilidad de desactivación:

$$
m_i \sim Bernoulli(1-p)
$$

la activación puede escalarse como:

$$
h'_i
=
\frac{h_i m_i}{1-p}
$$

Durante entrenamiento:

```text
Dropout activo
     ↓
Máscara aleatoria
     ↓
Escalado
```

Durante inferencia convencional:

```text
Dropout desactivado
     ↓
Red completa
     ↓
Predicción
```

El material enfatiza que Dropout busca reducir la dependencia entre neuronas y mejorar la generalización.

---

# 3. Fundamentos de redes neuronales convolucionales

Las **Convolutional Neural Networks (CNN)** están diseñadas para trabajar especialmente bien con información que presenta estructura espacial, como imágenes.

Una imagen puede representarse como un tensor:

$$
altura \times ancho \times canales
$$

Por ejemplo:

$$
60 \times 60 \times 3
$$

representa una imagen RGB de 60 × 60 píxeles.

---

## 3.1 Convolución

Una capa convolucional utiliza pequeños filtros o **kernels** que se desplazan sobre la imagen.

```text
Imagen
   ↓
Kernel
   ↓
Convolución
   ↓
Feature Map
```

Un kernel puede tener dimensiones:

$$
3\times3
$$

o:

$$
5\times5
$$

Cada filtro intenta detectar determinados patrones.

En capas iniciales pueden aparecer patrones relacionados con:

- Bordes.
- Líneas.
- Cambios de intensidad.

En capas posteriores pueden construirse representaciones más complejas.

---

## 3.2 Filtros y Feature Maps

Cada filtro aplicado sobre la entrada produce un **feature map o mapa de características**.

```text
Input
  │
  ├── Filter 1 → Feature Map 1
  ├── Filter 2 → Feature Map 2
  ├── Filter 3 → Feature Map 3
  └── ...
```

Por ello, si una capa utiliza 32 filtros:

```text
32 filtros
    ↓
32 feature maps
```

El número de filtros determina el número de canales de salida de la capa convolucional.

---

## 3.3 Conectividad local y Weight Sharing

Las CNN utilizan **conectividad local**.

Una neurona convolucional no observa toda la imagen simultáneamente, sino una pequeña región.

```text
Imagen

┌───────────────┐
│               │
│    ┌───┐      │
│    │3×3│      │
│    └───┘      │
│               │
└───────────────┘
```

Además, el mismo filtro se utiliza en diferentes posiciones de la imagen.

Esto se denomina **weight sharing**.

El mismo conjunto de pesos puede detectar una característica independientemente de dónde aparezca.

---

## 3.4 ReLU

Después de la convolución suele aplicarse una función de activación como **ReLU**.

$$
ReLU(x)=\max(0,x)
$$

Esto significa:

```text
x < 0  →  0

x > 0  →  x
```

ReLU introduce **no linealidad**, permitiendo que la red aprenda relaciones complejas.

---

## 3.5 Stride

El **stride** indica cuántas posiciones se desplaza el filtro en cada paso.

```text
Stride = 1

[Kernel]
  ↓
■■■□□□□
□■■■□□□
□□■■■□□
```

Con stride mayor, el filtro avanza más y la salida espacial disminuye.

---

## 3.6 Padding

El **padding** agrega valores alrededor de los bordes de la entrada.

### Valid Padding

No agrega padding.

La salida normalmente tiene dimensiones espaciales menores.

### Same Padding

Agrega padding para intentar conservar las dimensiones espaciales cuando el stride es 1.

```text
Original

■■■■
■■■■
■■■■
■■■■


Con padding

000000
0■■■■0
0■■■■0
0■■■■0
0■■■■0
000000
```

---

## 3.7 Tamaño de salida de una convolución

La dimensión de salida puede calcularse mediante:

$$
n_{out}
=
\left\lfloor
\frac{n+2p-f}{s}
\right\rfloor
+
1
$$

donde:

- $n$: dimensión de entrada.
- $p$: padding.
- $f$: tamaño del filtro.
- $s$: stride.

Por ejemplo:

$$
n=60,\quad f=5,\quad p=0,\quad s=1
$$

entonces:

$$
n_{out}
=
\frac{60-5}{1}+1
=
56
$$

La salida tendrá tamaño espacial:

$$
56\times56
$$

---

## 3.8 Pooling

El **pooling** reduce las dimensiones espaciales de los feature maps.

### Max Pooling

Selecciona el máximo dentro de una región.

Por ejemplo:

```text
1  5
2  3
```

produce:

$$
5
$$

Una operación 2 × 2 puede transformar:

$$
28\times28
$$

en:

$$
14\times14
$$

---

### Average Pooling

Utiliza el promedio de los valores.

Por ejemplo:

```text
1  5
2  4
```

produce:

$$
\frac{1+5+2+4}{4}=3
$$

---

## 3.9 Receptive Field

El **receptive field o campo receptivo** representa la región de la imagen original que influye sobre una determinada activación.

En las primeras capas:

```text
Receptive field pequeño
        ↓
Características locales
```

Al aumentar la profundidad:

```text
Receptive field mayor
        ↓
Información de regiones más grandes
```

Esto permite construir representaciones progresivamente más complejas.

---

## 3.10 Filtro Sobel

El filtro **Sobel** se utiliza tradicionalmente para detectar cambios de intensidad relacionados con bordes.

Puede aplicarse en diferentes direcciones:

```text
Sobel X
   ↓
Bordes verticales


Sobel Y
   ↓
Bordes horizontales
```

En visión tradicional, estos filtros se diseñan manualmente.

En una CNN, los filtros son aprendidos automáticamente durante el entrenamiento.

---

## 3.11 Filtro Laplaciano

El filtro **Laplaciano** también permite detectar regiones con cambios importantes de intensidad.

Conceptualmente:

```text
Imagen
   ↓
Filtro Laplaciano
   ↓
Cambios rápidos de intensidad
   ↓
Información de bordes
```

Sobel y Laplaciano ayudan a entender qué tipo de operaciones espaciales pueden aprender las capas convolucionales.

---

## 3.12 Bloque CNN básico

Una estructura típica puede representarse como:

```text
Imagen
   ↓
Convolution
   ↓
ReLU
   ↓
Pooling
   ↓
Convolution
   ↓
ReLU
   ↓
Pooling
   ↓
Flatten
   ↓
Dense
   ↓
Output
```

Cada componente tiene una función:

| Componente | Función |
|---|---|
| Convolution | Extraer características |
| ReLU | Introducir no linealidad |
| Pooling | Reducir dimensión espacial |
| Flatten | Convertir mapas en vector |
| Dense | Realizar clasificación |
| Softmax | Producir probabilidades de clase |

---

# 4. Arquitecturas y técnicas complementarias

Después de comprender los componentes de una CNN, se revisaron arquitecturas que combinan estos elementos de diferentes maneras.

---

## 4.1 LeNet-5

**LeNet-5** es una arquitectura CNN clásica diseñada originalmente para reconocimiento de caracteres.

Su estructura general puede representarse como:

```text
32×32×1
   ↓
Conv 5×5
   ↓
28×28×6
   ↓
Pooling
   ↓
14×14×6
   ↓
Conv 5×5
   ↓
10×10×16
   ↓
Pooling
   ↓
5×5×16
   ↓
Flatten
   ↓
400
   ↓
Dense 120
   ↓
Dense 84
   ↓
Output
```

LeNet demuestra el principio básico de las CNN:

```text
Extracción de características
          ↓
Clasificación
```

Las primeras capas extraen información espacial.

Las capas finales utilizan esas características para realizar la clasificación.

---

## 4.2 Batch Normalization

**Batch Normalization (BatchNorm)** normaliza activaciones utilizando estadísticas calculadas sobre un mini-batch.

Conceptualmente:

```text
Activaciones
     ↓
Media y varianza del batch
     ↓
Normalización
     ↓
Escalado y desplazamiento
     ↓
Siguiente capa
```

BatchNorm puede ayudar a:

- Estabilizar el entrenamiento.
- Facilitar la optimización.
- Permitir un entrenamiento más consistente.

Normalmente no cambia las dimensiones del tensor.

```text
Input

56×56×64

      ↓ BatchNorm

56×56×64
```

---

## 4.3 Layer Normalization

**Layer Normalization (LayerNorm)** utiliza una estrategia diferente.

En lugar de depender de estadísticas calculadas entre ejemplos del batch, normaliza características dentro de cada ejemplo.

Conceptualmente:

```text
BatchNorm
↓
estadísticas relacionadas con el batch


LayerNorm
↓
estadísticas dentro de cada ejemplo
```

Ambos métodos persiguen mejorar la estabilidad del entrenamiento, pero normalizan sobre dimensiones diferentes.

---

## 4.4 Skip Connections

Cuando las redes se vuelven muy profundas, el entrenamiento puede hacerse más difícil.

ResNet introduce las **skip connections o conexiones de salto**.

En lugar de que una capa solamente produzca:

$$
y=F(x)
$$

se agrega la entrada original:

$$
y=F(x)+x
$$

Conceptualmente:

```text
x ────────────────┐
│                 │
↓                 │
Layers            │
│                 │
↓                 │
F(x)              │
│                 │
└────── (+) ←─────┘
          ↓
       F(x)+x
```

La conexión proporciona una ruta directa para la información.

---

## 4.5 Bloque de identidad

Cuando las dimensiones de entrada y salida son iguales, puede utilizarse directamente:

$$
y=F(x)+x
$$

Por ejemplo:

```text
Input
56×56×64
    │
    ├───────────────┐
    ↓               │
Convolutions        │
    ↓               │
F(x) 56×56×64       │
    │               │
    └──── (+) ←─────┘
           ↓
       56×56×64
```

La suma es posible porque ambas ramas tienen la misma forma.

---

## 4.6 Projection Shortcut

Cuando las dimensiones son diferentes, no podemos sumar directamente $F(x)$ y $x$.

Por ejemplo:

```text
Input

56×56×64

Output

28×28×128
```

Entonces la rama shortcut puede utilizar una convolución $1\times1$ para transformar la entrada.

La operación puede representarse como:

$$
y=F(x)+W_sx
$$

Conceptualmente:

```text
x 56×56×64
     │
     ├───────────────┐
     │               ↓
     │          Conv 1×1
     │          stride 2
     │               ↓
     │          28×28×128
     ↓               │
Residual branch      │
     ↓               │
28×28×128            │
     └────── (+) ────┘
              ↓
          28×28×128
```

---

## 4.7 ResNet

**ResNet — Residual Network** utiliza múltiples bloques residuales conectados mediante skip connections.

Conceptualmente:

```text
Input
  ↓
Convolution
  ↓
Residual Block
  ↓
Residual Block
  ↓
Residual Block
  ↓
...
  ↓
Global Average Pooling
  ↓
Dense
  ↓
Output
```

La idea fundamental es aprender una función residual:

$$
F(x)
$$

y combinarla con la entrada:

$$
y=F(x)+x
$$

Esto facilita la optimización de redes profundas.

---

## 4.8 ResNet-50

ResNet-50 utiliza bloques denominados **bottleneck blocks**.

La estructura típica es:

```text
1×1 Conv
   ↓
3×3 Conv
   ↓
1×1 Conv
   ↓
Skip Connection
```

Una organización conocida de ResNet-50 utiliza:

```text
[64, 64, 256] × 3

[128, 128, 512] × 4

[256, 256, 1024] × 6

[512, 512, 2048] × 3
```

La convolución $1\times1$ permite modificar el número de canales con un costo computacional menor que utilizar filtros grandes para toda la transformación.

---

## 4.9 Data Augmentation

**Data Augmentation** crea versiones modificadas de las imágenes de entrenamiento.

El objetivo es incrementar la diversidad de los datos sin necesidad de recolectar nuevas imágenes etiquetadas.

Ejemplos:

```text
Imagen original
      │
      ├── Horizontal Flip
      ├── Rotation
      ├── Zoom
      ├── Translation
      ├── Brightness
      ├── Contrast
      └── Blur
```

La idea principal es:

```text
Dataset original
      ↓
Transformaciones
      ↓
Mayor diversidad
      ↓
Menor riesgo de overfitting
      ↓
Mejor generalización
```

Las transformaciones deben conservar la clase semántica de la imagen.

Por ejemplo, para clasificación de habitaciones:

```text
Bedroom
   ↓
Horizontal Flip
   ↓
Sigue siendo Bedroom
```

Una transformación excesivamente artificial podría dejar de representar correctamente los datos reales.

---

## 4.10 Training, Validation y Data Augmentation

La data augmentation aleatoria se aplica normalmente al conjunto de entrenamiento.

```text
TRAINING SET
     ↓
Data Augmentation
     ↓
Modelo
```

Los conjuntos de validación y test normalmente permanecen sin transformaciones aleatorias:

```text
VALIDATION / TEST
        ↓
Imágenes originales
        ↓
Evaluación
```

Esto permite medir el rendimiento del modelo sobre datos consistentes.

---

# Flujo general de los conceptos de la semana

Los cuatro bloques estudiados pueden conectarse de la siguiente manera:

```text
                 DATOS
                   ↓
             Red neuronal
                   ↓
             Predicción
                   ↓
            Función de pérdida
                   ↓
              Gradiente
                   ↓
              Optimización
        ┌──────────┼───────────┐
       SGD      RMSProp       Adam
                   ↓
         Actualización de pesos
                   ↓
              Entrenamiento
                   ↓
          ¿El modelo generaliza?
            │             │
           Sí            No
            │             ↓
            │       Regularización
            │       L1 / L2
            │       Dropout
            │       Data Augmentation
            │
            ↓
         CNN para imágenes
            ↓
    Convolution + ReLU + Pooling
            ↓
       Feature extraction
            ↓
      Arquitecturas profundas
            ↓
       LeNet / ResNet
            ↓
         Predicción final
```

---

# Resumen de la semana

## 1. Optimización

El entrenamiento de una red neuronal consiste en minimizar una función de pérdida.

Se revisaron:

- Optimización convexa y no convexa.
- Gradiente.
- Learning rate.
- SGD.
- Mini-batch.
- Full batch.
- Momentum.
- RMSProp.
- Adam.

---

## 2. Regularización y generalización

El objetivo es evitar que el modelo memorice excesivamente los datos de entrenamiento.

Se revisaron:

- Underfitting.
- Overfitting.
- Bias.
- Variance.
- L1.
- L2.
- Elastic Net.
- Weight decay.
- Dropout.

---

## 3. Fundamentos de CNN

Las CNN utilizan operaciones espaciales para aprender características directamente de las imágenes.

Se revisaron:

- Convolución.
- Kernels.
- Feature maps.
- ReLU.
- Stride.
- Padding.
- Max Pooling.
- Average Pooling.
- Receptive fields.
- Sobel.
- Laplacian.

---

## 4. Arquitecturas y técnicas complementarias

Los componentes anteriores permiten construir redes más profundas.

Se revisaron:

- LeNet-5.
- Batch Normalization.
- Layer Normalization.
- Skip connections.
- Identity blocks.
- Projection shortcuts.
- ResNet.
- ResNet-50.
- Data augmentation.

---

# Ideas principales que debo recordar

1. Las redes neuronales aprenden modificando sus parámetros para reducir una función de pérdida.

2. Las funciones de pérdida de las redes profundas son generalmente no convexas.

3. El gradiente indica cómo modificar los parámetros para reducir la pérdida.

4. La tasa de aprendizaje controla el tamaño de las actualizaciones.

5. SGD, Momentum, RMSProp y Adam utilizan diferentes estrategias para realizar las actualizaciones.

6. Un modelo debe generalizar, no simplemente memorizar los datos de entrenamiento.

7. Overfitting representa un exceso de adaptación y underfitting una capacidad insuficiente de aprendizaje.

8. L1, L2, weight decay y Dropout son estrategias relacionadas con regularización.

9. Las CNN utilizan filtros para aprender características espaciales.

10. Cada filtro convolucional produce un feature map.

11. ReLU introduce no linealidad.

12. Pooling reduce las dimensiones espaciales.

13. Stride y padding controlan el desplazamiento de los filtros y las dimensiones de salida.

14. LeNet-5 representa una arquitectura CNN clásica.

15. BatchNorm y LayerNorm buscan mejorar la estabilidad del entrenamiento mediante normalización.

16. ResNet utiliza skip connections para facilitar el entrenamiento de redes profundas.

17. Cuando las dimensiones cambian, puede utilizarse una convolución $1\times1$ en la rama shortcut.

18. Data augmentation incrementa la diversidad de los datos de entrenamiento y puede ayudar a reducir overfitting.

---

# Conceptos clave

| Español | Inglés |
|---|---|
| Optimización | Optimization |
| Función de pérdida | Loss function |
| Gradiente | Gradient |
| Tasa de aprendizaje | Learning rate |
| Descenso de gradiente estocástico | Stochastic Gradient Descent |
| Mini-lote | Mini-batch |
| Momentum | Momentum |
| RMSProp | RMSProp |
| Generalización | Generalization |
| Sobreajuste | Overfitting |
| Subajuste | Underfitting |
| Regularización | Regularization |
| Convolución | Convolution |
| Filtro / Kernel | Filter / Kernel |
| Mapa de características | Feature map |
| Paso | Stride |
| Relleno | Padding |
| Campo receptivo | Receptive field |
| Pooling | Pooling |
| Conexión de salto | Skip connection |
| Bloque residual | Residual block |
| Normalización por lote | Batch Normalization |
| Normalización por capa | Layer Normalization |
| Aumento de datos | Data Augmentation |

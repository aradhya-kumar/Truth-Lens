import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
import os
import json

# =========================
# PATH
# =========================
dataset_path = "Frames"

# =========================
# LOAD DATA
# =========================
train_data = tf.keras.preprocessing.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(224, 224),
    batch_size=32
)

val_data = tf.keras.preprocessing.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(224, 224),
    batch_size=32
)

# =========================
# NORMALIZATION
# =========================
normalization_layer = layers.Rescaling(1./255)

train_data = train_data.map(lambda x, y: (normalization_layer(x), y))
val_data = val_data.map(lambda x, y: (normalization_layer(x), y))

# =========================
# AUGMENTATION
# =========================
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.2),
])

train_data = train_data.map(lambda x, y: (data_augmentation(x), y))

# =========================
# PREFETCH
# =========================
AUTOTUNE = tf.data.AUTOTUNE
train_data = train_data.prefetch(AUTOTUNE)
val_data = val_data.prefetch(AUTOTUNE)

# =========================
# MODEL
# =========================
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.BatchNormalization()(x)
x = layers.Dense(128, activation="relu")(x)
x = layers.Dropout(0.5)(x)
output = layers.Dense(1, activation="sigmoid")(x)

model = models.Model(inputs=base_model.input, outputs=output)

# =========================
# COMPILE
# =========================
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# =========================
# CALLBACKS
# =========================
early_stop = EarlyStopping(patience=3, restore_best_weights=True)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.3,
    patience=2,
    min_lr=1e-6
)

# =========================
# TRAIN PHASE 1
# =========================
history1 = model.fit(
    train_data,
    validation_data=val_data,
    epochs=5,
    callbacks=[early_stop, reduce_lr]
)

# =========================
# FINE TUNE
# =========================
base_model.trainable = True

for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

history2 = model.fit(
    train_data,
    validation_data=val_data,
    epochs=3,
    callbacks=[early_stop]
)

# =========================
# COMBINE HISTORY
# =========================
train_acc = history1.history['accuracy'] + history2.history['accuracy']
val_acc = history1.history['val_accuracy'] + history2.history['val_accuracy']
train_loss = history1.history['loss'] + history2.history['loss']
val_loss = history1.history['val_loss'] + history2.history['val_loss']

# =========================
# SAVE MODEL
# =========================
os.makedirs("Models", exist_ok=True)
model.save("Models/deepfake_model.h5")

# =========================
# SAVE LOGS
# =========================
log_data = {
    "train_accuracy": train_acc,
    "val_accuracy": val_acc,
    "train_loss": train_loss,
    "val_loss": val_loss
}

with open("Models/training_logs.json", "w") as f:
    json.dump(log_data, f)

# TEXT LOG
with open("Models/training_logs.txt", "w") as f:
    for i in range(len(train_acc)):
        f.write(f"Epoch {i+1}: Train Acc={train_acc[i]:.4f}, Val Acc={val_acc[i]:.4f}, "
                f"Train Loss={train_loss[i]:.4f}, Val Loss={val_loss[i]:.4f}\n")

# =========================
# PLOTS
# =========================
plt.figure()
plt.plot(train_acc, label="Train Accuracy")
plt.plot(val_acc, label="Val Accuracy")
plt.title("Accuracy")
plt.legend()
plt.savefig("Models/accuracy_plot.png")

plt.figure()
plt.plot(train_loss, label="Train Loss")
plt.plot(val_loss, label="Val Loss")
plt.title("Loss")
plt.legend()
plt.savefig("Models/loss_plot.png")

print("✅ Training complete + logs + plots saved!")
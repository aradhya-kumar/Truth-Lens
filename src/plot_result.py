import matplotlib.pyplot as plt

# Your values
train_acc = [0.7427, 0.7424, 0.7350, 0.7618, 0.7810, 0.7983, 0.8086]
val_acc = [0.7395, 0.7417, 0.7643, 0.7835, 0.7966, 0.8075, 0.8231]

epochs = range(1, len(train_acc) + 1)

plt.plot(epochs, train_acc, label='Training Accuracy')
plt.plot(epochs, val_acc, label='Validation Accuracy')

plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.savefig("accuracy_plot.png")
plt.show()
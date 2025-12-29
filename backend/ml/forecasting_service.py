import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def train_lstm(data, days=7):
    data = np.array(data, dtype=float)
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(data.reshape(-1, 1))

    X, y = [], []
    for i in range(len(scaled) - days):
        X.append(scaled[i:i+days])
        y.append(scaled[i+days])

    X, y = np.array(X), np.array(y)

    model = Sequential([
        LSTM(50, input_shape=(days, 1)),
        Dense(1)
    ])

    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=20, verbose=0)

    last_seq = scaled[-days:]
    prediction = model.predict(last_seq.reshape(1, days, 1))
    prediction = scaler.inverse_transform(prediction)[0][0]

    return max(0, round(prediction))

@app.route("/forecast", methods=["POST"])
def forecast():
    sales = request.json.get("sales", [])

    if len(sales) < 7:
        return jsonify({"predicted_demand": 0})

    prediction = train_lstm(sales)
    return jsonify({"predicted_demand": prediction})

if __name__ == "__main__":
    app.run(port=2500)

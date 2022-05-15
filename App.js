import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "b9f77474d3fc53be4b542a6cab77b8fa";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(false);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return;
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr`
    );
    const json = await response.json();
    console.log(json.daily);
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.weather}>
        {days.length === 0 ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <ScrollView pagingEnabled horizontal>
            {days.map((day, index) => (
              <View key={index} style={styles.day}>
                <Text style={styles.dateText}>
                  {new Date(day.dt * 1000).toString().substring(0, 10)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Fontisto
                    name={icons[day.weather[0].main]}
                    size={68}
                    color="black"
                  />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: { flex: 2, alignItems: "center", justifyContent: "center" },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 60,
  },
  temp: {
    fontSize: 118,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
});

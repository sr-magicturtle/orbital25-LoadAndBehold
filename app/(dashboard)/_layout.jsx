import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const DashboardLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#D3D3D3",
                    paddingTop: 10,
                    height: 90,
                },
                tabBarInactiveTintColor: "#949494",
                tabBarActiveTintColor: "#3F3F3F",
            }}
        >
            <Tabs.Screen
                name="homepage"
                options={{
                    title: "Homepage",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "home" : "home-outline"}
                            color={focused ? "#3F3F3F" : "#949494"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="queue"
                options={{
                    title: "Queue",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "list" : "list-outline"}
                            color={focused ? "#3F3F3F" : "#949494"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="qrscanner"
                options={{
                    title: "QR Scanner",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "scan" : "scan-outline"}
                            color={focused ? "#3F3F3F" : "#949494"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "time" : "time-outline"}
                            color={focused ? "#3F3F3F" : "#949494"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "person" : "person-outline"}
                            color={focused ? "#3F3F3F" : "#949494"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default DashboardLayout;
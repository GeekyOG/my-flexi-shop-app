import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const Icons = ({ name, size = 20, color = "#6B7280" }) => {
  const icons = {
    user: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={2} />
      </Svg>
    ),

    camera: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          stroke={color}
          strokeWidth={2}
        />
        <Circle cx={12} cy={13} r={4} stroke={color} strokeWidth={2} />
      </Svg>
    ),

    lock: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x={3}
          y={11}
          width={18}
          height={11}
          rx={2}
          stroke={color}
          strokeWidth={2}
        />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} />
      </Svg>
    ),
  };

  return <View>{icons[name] || null}</View>;
};

export default Icons;

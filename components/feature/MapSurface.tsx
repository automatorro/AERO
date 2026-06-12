// Powered by OnSpace.AI
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius } from '@/constants/theme';

export interface MapPin {
  x: number;
  y: number;
  kind: 'pickup' | 'dropoff' | 'driver' | 'passenger';
  label?: string;
}

interface MapSurfaceProps {
  pins?: MapPin[];
  showRoute?: boolean;
  style?: ViewStyle | ViewStyle[];
  height?: number;
}

const PIN_COLOR = {
  pickup: colors.primary,
  dropoff: colors.ink,
  driver: '#3B82F6',
  passenger: colors.warning,
} as const;

const PIN_ICON = {
  pickup: 'my-location',
  dropoff: 'place',
  driver: 'local-taxi',
  passenger: 'person-pin-circle',
} as const;

export function MapSurface({ pins = [], showRoute, style, height }: MapSurfaceProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    setSize({ w: width, h });
  };

  const pickup = pins.find((p) => p.kind === 'pickup');
  const dropoff = pins.find((p) => p.kind === 'dropoff');

  return (
    <View
      onLayout={onLayout}
      style={[styles.map, height ? { height } : styles.flex, style as ViewStyle]}
    >
      {/* grid lines */}
      {[0.2, 0.4, 0.6, 0.8].map((g) => (
        <View key={`h${g}`} style={[styles.gridH, { top: `${g * 100}%` }]} />
      ))}
      {[0.25, 0.5, 0.75].map((g) => (
        <View key={`v${g}`} style={[styles.gridV, { left: `${g * 100}%` }]} />
      ))}
      {/* decorative roads */}
      <View style={[styles.road, { top: '38%', transform: [{ rotate: '-8deg' }] }]} />
      <View style={[styles.roadV, { left: '60%', transform: [{ rotate: '6deg' }] }]} />

      {/* route line */}
      {showRoute && pickup && dropoff && size.w > 0 ? (
        <RouteLine from={pickup} to={dropoff} size={size} />
      ) : null}

      {/* pins */}
      {size.w > 0
        ? pins.map((p, i) => (
            <View
              key={`${p.kind}_${i}`}
              style={[
                styles.pinWrap,
                { left: p.x * size.w - 18, top: p.y * size.h - 36 },
              ]}
            >
              <View style={[styles.pin, { backgroundColor: PIN_COLOR[p.kind] }]}>
                <MaterialIcons name={PIN_ICON[p.kind]} size={18} color="#fff" />
              </View>
              {p.label ? (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText} numberOfLines={1}>
                    {p.label}
                  </Text>
                </View>
              ) : null}
            </View>
          ))
        : null}

      <View style={styles.attribution}>
        <Text style={styles.attrText}>AERO Maps · vizualizare demo</Text>
      </View>
    </View>
  );
}

function RouteLine({
  from,
  to,
  size,
}: {
  from: MapPin;
  to: MapPin;
  size: { w: number; h: number };
}) {
  const x1 = from.x * size.w;
  const y1 = from.y * size.h;
  const x2 = to.x * size.w;
  const y2 = to.y * size.h;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1 - 2,
        width: length,
        height: 4,
        backgroundColor: colors.routeLine,
        borderRadius: 2,
        transform: [{ translateY: 0 }, { rotate: `${angle}deg` }],
        transformOrigin: 'left center',
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    backgroundColor: colors.mapBg,
    overflow: 'hidden',
    position: 'relative',
  },
  flex: { flex: 1 },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.mapGrid },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: colors.mapGrid },
  road: { position: 'absolute', left: '-10%', width: '120%', height: 10, backgroundColor: colors.mapRoad },
  roadV: { position: 'absolute', top: '-10%', height: '120%', width: 10, backgroundColor: colors.mapRoad },
  pinWrap: { position: 'absolute', alignItems: 'center', width: 36 },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    maxWidth: 120,
  },
  pinLabelText: { fontSize: 10, fontWeight: fontWeight.semibold, color: colors.text },
  attribution: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  attrText: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
});

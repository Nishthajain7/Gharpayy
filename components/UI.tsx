import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, STAGE_COLORS, Stage } from '@/constants/theme';

export function Card({
    children, style, onPress,
}: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void }) {
    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[s.card, style]}>
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={[s.card, style]}>{children}</View>;
}

export function StageBadge({ stage, small }: { stage: Stage; small?: boolean }) {
    const color = STAGE_COLORS[stage] ?? COLORS.textMuted;
    return (
        <View style={[s.badge, {
            backgroundColor: color + '22',
            borderColor: color + '55',
            paddingHorizontal: small ? 7 : 10,
            paddingVertical: small ? 2 : 4,
        }]}>
            <Text style={[s.badgeText, { color, fontSize: small ? 9 : 11 }]}>{stage}</Text>
        </View>
    );
}

export function SourceBadge({ source }: { source: string }) {
    return (
        <View style={[s.badge, { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary + '40' }]}>
            <Text style={[s.badgeText, { color: COLORS.primary, fontSize: 10 }]}>{source}</Text>
        </View>
    );
}

type BtnVariant = 'primary' | 'filled' | 'success' | 'danger' | 'ghost';

export function Btn({
    onPress, label, variant = 'primary', small, disabled, style,
}: {
    onPress: () => void; label: string; variant?: BtnVariant;
    small?: boolean; disabled?: boolean; style?: ViewStyle;
}) {
    const v = {
        primary: { bg: 'transparent', border: COLORS.primary, text: COLORS.primary },
        filled: { bg: COLORS.primary, border: COLORS.primary, text: '#fff' },
        success: { bg: COLORS.success + '20', border: COLORS.success + '50', text: COLORS.success },
        danger: { bg: COLORS.danger + '20', border: COLORS.danger + '50', text: COLORS.danger },
        ghost: { bg: COLORS.surface2, border: COLORS.border2, text: COLORS.textSub },
    }[variant];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[s.btn, {
                backgroundColor: v.bg,
                borderColor: v.border,
                paddingHorizontal: small ? 12 : 18,
                paddingVertical: small ? 6 : 10,
                opacity: disabled ? 0.45 : 1,
            }, style]}
        >
            <Text style={[s.btnText, { color: v.text, fontSize: small ? 11 : 13 }]}>{label}</Text>
        </TouchableOpacity>
    );
}

export function Avatar({ initials, size = 32, online }: { initials: string; size?: number; online?: boolean }) {
    return (
        <View style={{ position: 'relative', width: size, height: size }}>
            <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
                <Text style={{ color: '#fff', fontSize: size * 0.3, fontWeight: '700' }}>{initials}</Text>
            </View>
            {online && (
                <View style={[s.onlineDot, {
                    width: size * 0.28, height: size * 0.28,
                    borderRadius: size * 0.14, bottom: 0, right: 0,
                }]} />
            )}
        </View>
    );
}

export function StatCard({ label, value, color, sub }: {
    label: string; value: string | number; color?: string; sub?: string;
}) {
    return (
        <View style={[s.card, s.statCard]}>
            <Text style={s.statLabel}>{label}</Text>
            <Text style={[s.statValue, color ? { color } : {}]}>{value}</Text>
            {sub ? <Text style={s.statSub}>{sub}</Text> : null}
        </View>
    );
}

export function InfoRow({ icon, label, value, valueColor }: {
    icon: string; label: string; value?: string | null; valueColor?: string;
}) {
    return (
        <View style={s.infoRow}>
            <Text style={s.infoIcon}>{icon}</Text>
            <Text style={s.infoLabel}>{label}</Text>
            <Text style={[s.infoValue, valueColor ? { color: valueColor } : {}]}>{value || '—'}</Text>
        </View>
    );
}

export function Divider() {
    return <View style={s.divider} />;
}

export function EmptyState({ icon = '📭', message }: { icon?: string; message: string }) {
    return (
        <View style={s.empty}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>{icon}</Text>
            <Text style={s.emptyText}>{message}</Text>
        </View>
    );
}

export function CardTitle({ title }: { title: string }) {
    return <Text style={s.cardTitle}>{title}</Text>;
}

const s = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
    },
    badge: {
        borderWidth: 1,
        borderRadius: 20,
        alignSelf: 'flex-start',
        paddingHorizontal: 6
    },
    badgeText: { fontWeight: '700', letterSpacing: 0.2 },
    btn: {
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: { fontWeight: '700', letterSpacing: 0.2 },
    avatar: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlineDot: {
        position: 'absolute',
        backgroundColor: COLORS.success,
        borderWidth: 1.5,
        borderColor: COLORS.bg,
    },
    statCard: { flex: 1 },
    statLabel: {
        color: COLORS.textMuted, fontSize: 10, fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
    },
    statValue: { color: COLORS.text, fontSize: 26, fontWeight: '800', lineHeight: 30 },
    statSub: { color: COLORS.textDim, fontSize: 11, marginTop: 4 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoIcon: { fontSize: 14, marginRight: 8, width: 20 },
    infoLabel: { color: COLORS.textMuted, fontSize: 12, flex: 1 },
    infoValue: { color: COLORS.textSub, fontSize: 12, fontWeight: '600' },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { color: COLORS.textDim, fontSize: 14, textAlign: 'center' },
    cardTitle: {
        color: COLORS.textMuted, fontSize: 11, fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
    },
});

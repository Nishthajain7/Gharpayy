import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import { COLORS, STAGE_COLORS, hoursAgo, nowISO } from '@/constants/theme';

function urgency(days: number) {
  if (days >= 7) return { emoji: '🔴', color: COLORS.danger,  label: 'Critical',  bg: COLORS.danger  + '12' };
  if (days >= 3) return { emoji: '🟡', color: COLORS.warning, label: 'High',      bg: COLORS.warning + '12' };
  return          { emoji: '🔵', color: COLORS.primary, label: 'Follow-up', bg: COLORS.primary + '10' };
}

export default function FollowupsScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppStore();
  const { leads, agents } = state;

  const followups = leads
    .filter(l => l.stage !== 'Booked' && l.stage !== 'Lost' && hoursAgo(l.lastActivity) >= 24)
    .sort((a, b) => new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime());

  if (followups.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>✅</Text>
        <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '700' }}>All leads up to date!</Text>
        <Text style={{ color: COLORS.textDim, fontSize: 13, marginTop: 6 }}>No follow-ups required right now.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: 4 }}>Follow-up Alerts</Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 16 }}>
        {followups.length} lead{followups.length !== 1 ? 's' : ''} need attention
      </Text>

      {followups.map(lead => {
        const hours = hoursAgo(lead.lastActivity);
        const days  = Math.floor(hours / 24);
        const agent = agents.find(a => a.id === lead.agentId);
        const urg   = urgency(days);

        return (
          <View key={lead.id} style={[s.card, { backgroundColor: urg.bg, borderLeftColor: urg.color }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <Text style={{ fontSize: 16, marginTop: 2 }}>{urg.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '700' }}>{lead.name}</Text>
                <Text style={{ color: COLORS.textSub, fontSize: 12, marginTop: 2 }}>{lead.phone} · {lead.source}</Text>
              </View>
              <View style={{ borderWidth: 1, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3, backgroundColor: urg.color + '25', borderColor: urg.color + '60' }}>
                <Text style={{ color: urg.color, fontSize: 10, fontWeight: '700' }}>{urg.label}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: STAGE_COLORS[lead.stage] }} />
              <Text style={{ color: STAGE_COLORS[lead.stage], fontSize: 11, fontWeight: '600' }}>{lead.stage}</Text>
              <Text style={{ color: COLORS.textDim, fontSize: 11 }}>·</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 11 }}>{agent?.name?.split(' ')[0]}</Text>
              <Text style={{ color: COLORS.textDim, fontSize: 11 }}>·</Text>
              <Text style={{ color: urg.color, fontSize: 11 }}>Inactive {days}d {hours % 24}h</Text>
            </View>

            {/* Day tier pills */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {[1, 3, 7].map(d => (
                <View key={d} style={{ borderWidth: 1, borderColor: days >= d ? urg.color + '70' : COLORS.border2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: days >= d ? urg.color + '30' : 'transparent' }}>
                  <Text style={{ color: days >= d ? urg.color : COLORS.textDim, fontSize: 10, fontWeight: '600' }}>Day {d}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/modal', params: { leadId: lead.id } })}
                style={{ flex: 1, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border2, borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textSub, fontSize: 12, fontWeight: '600' }}>View Lead</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch({ type: 'UPDATE_LEAD', payload: { id: lead.id, updates: {} } })}
                style={{ flex: 1, backgroundColor: COLORS.success + '15', borderWidth: 1, borderColor: COLORS.success + '40', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: COLORS.success, fontSize: 12, fontWeight: '700' }}>✓ Followed Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch({ type: 'UPDATE_LEAD', payload: { id: lead.id, updates: { stage: 'Lost' } } })}
                style={{ flex: 1, backgroundColor: COLORS.danger + '15', borderWidth: 1, borderColor: COLORS.danger + '40', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: COLORS.danger, fontSize: 12, fontWeight: '700' }}>✗ Lost</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  card: { borderLeftWidth: 3, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
});

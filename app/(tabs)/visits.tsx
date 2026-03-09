import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import { COLORS, fmtDateTime } from '@/constants/theme';
import { Card } from '@/components/UI';

export default function VisitsScreen() {
  const router = useRouter();
  const { state } = useAppStore();
  const { leads, agents, properties } = state;

  const withVisit = leads.filter(l => l.visitDate).sort((a, b) => new Date(a.visitDate!).getTime() - new Date(b.visitDate!).getTime());
  const upcoming  = withVisit.filter(l => new Date(l.visitDate!) > new Date());
  const past      = withVisit.filter(l => new Date(l.visitDate!) <= new Date());

  const VisitCard = ({ lead }: { lead: typeof leads[0] }) => {
    const agent    = agents.find(a => a.id === lead.agentId);
    const prop     = properties.find(p => p.id === lead.visitProperty);
    const isPast   = new Date(lead.visitDate!) <= new Date();
    const outcome  = lead.visitOutcome;
    const oc = outcome === 'Booked' ? COLORS.success : outcome === 'Considering' ? COLORS.warning : outcome === 'Not Interested' ? COLORS.danger : null;
    const dc = oc ?? (isPast ? COLORS.warning : COLORS.primary);

    return (
      <Card onPress={() => router.push({ pathname: '/modal', params: { leadId: lead.id } })} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.text, fontWeight: '700', fontSize: 14 }}>{lead.name}</Text>
            <Text style={{ color: COLORS.textSub, fontSize: 12, marginTop: 2 }}>{lead.phone}</Text>
          </View>
          <View style={{ borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: dc + '20', borderColor: dc + '60' }}>
            <Text style={{ color: dc, fontSize: 11, fontWeight: '700' }}>{outcome ?? (isPast ? 'Awaiting Outcome' : 'Upcoming')}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 4 }}>
          <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>📍 {prop?.name ?? '—'}</Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>🕐 {fmtDateTime(lead.visitDate)}</Text>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>👤 {agent?.name ?? '—'}</Text>
      </Card>
    );
  };

  const Section = ({ title, color, data }: { title: string; color: string; data: typeof leads }) => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        <Text style={{ color, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, flex: 1 }}>{title}</Text>
        <Text style={{ color: COLORS.textDim, fontSize: 12, fontWeight: '700' }}>{data.length}</Text>
      </View>
      {data.length === 0 ? (
        <View style={{ backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 20, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textDim, fontSize: 13 }}>None scheduled.</Text>
        </View>
      ) : data.map(l => <VisitCard key={l.id} lead={l} />)}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: 4 }}>Visit Schedule</Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
        {upcoming.length} upcoming · {past.length} completed
      </Text>
      <Section title="Upcoming Visits" color={COLORS.primary} data={upcoming} />
      <Section title="Past Visits"     color={COLORS.textMuted} data={past} />
    </ScrollView>
  );
}

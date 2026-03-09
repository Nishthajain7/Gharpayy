// app/(tabs)/index.tsx  — Dashboard
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppStore } from '@/hooks/useAppStore';
import { COLORS, STAGES, STAGE_COLORS, SOURCES } from '@/constants/theme';
import { StatCard, Card, CardTitle, Avatar, Divider } from '@/components/UI';

export default function DashboardScreen() {
  const { state } = useAppStore();
  const { leads, agents } = state;

  const total   = leads.length;
  const booked  = leads.filter(l => l.stage === 'Booked').length;
  const visits  = leads.filter(l => ['Visit Scheduled','Visit Completed','Booked'].includes(l.stage)).length;
  const convRate = total > 0 ? ((booked / total) * 100).toFixed(1) : '0.0';

  const resp = leads.filter(l => l.firstResponseAt);
  const avgResp = resp.length
    ? Math.round(resp.reduce((s, l) => s + (new Date(l.firstResponseAt!).getTime() - new Date(l.createdAt).getTime()) / 60000, 0) / resp.length)
    : 0;
  const slaBreached = resp.filter(l => (new Date(l.firstResponseAt!).getTime() - new Date(l.createdAt).getTime()) / 60000 > 5).length;

  const stageCounts = STAGES.map(s => ({ stage: s, count: leads.filter(l => l.stage === s).length }));
  const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

  const agentStats = agents.map(a => {
    const al = leads.filter(l => l.agentId === a.id);
    const ab = al.filter(l => l.stage === 'Booked').length;
    const ar = al.filter(l => l.firstResponseAt);
    return {
      ...a,
      leadCount: al.length,
      booked: ab,
      convRate: al.length ? Math.round((ab / al.length) * 100) : 0,
      avgResp: ar.length
        ? Math.round(ar.reduce((s, l) => s + (new Date(l.firstResponseAt!).getTime() - new Date(l.createdAt).getTime()) / 60000, 0) / ar.length)
        : null,
    };
  });

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.scroll}>
      <View style={s.statRow}>
        <StatCard label="Total Leads" value={total} sub="All time" />
        <View style={{ width: 10 }} />
        <StatCard label="Booked" value={booked} color={COLORS.success} sub={`${convRate}% conv.`} />
      </View>
      <View style={[s.statRow, { marginTop: 10 }]}>
        <StatCard label="Visits" value={visits} color={COLORS.warning} sub="Sched + Done" />
        <View style={{ width: 10 }} />
        <StatCard
          label="Avg Response" value={`${avgResp}m`}
          color={avgResp <= 5 ? COLORS.success : COLORS.danger}
          sub={`${slaBreached} SLA breach${slaBreached !== 1 ? 'es' : ''}`}
        />
      </View>

      <Card style={{ marginTop: 16 }}>
        <CardTitle title="Pipeline Funnel" />
        {stageCounts.map(({ stage, count }) => (
          <View key={stage} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: STAGE_COLORS[stage], marginRight: 8 }} />
              <Text style={{ color: COLORS.textSub, fontSize: 12, flex: 1 }}>{stage}</Text>
              <Text style={{ color: STAGE_COLORS[stage], fontSize: 12, fontWeight: '700' }}>{count}</Text>
            </View>
            <View style={{ height: 5, backgroundColor: COLORS.surface2, borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ height: 5, width: `${(count / maxCount) * 100}%` as any, backgroundColor: STAGE_COLORS[stage], borderRadius: 3 }} />
            </View>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle title="Agent Leaderboard" />
        {[...agentStats].sort((a, b) => b.booked - a.booked).map((a, i, arr) => (
          <View key={a.id}>
            {i > 0 ? <Divider /> : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
              <Avatar initials={a.avatar} size={36} online={a.active} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '600' }}>{a.name}</Text>
                <Text style={{ color: COLORS.textDim, fontSize: 11, marginTop: 2 }}>
                  {a.leadCount} leads · {a.booked} booked{a.avgResp !== null ? ` · ${a.avgResp}m avg` : ''}
                </Text>
              </View>
              <Text style={{ color: COLORS.success, fontSize: 13, fontWeight: '700' }}>{a.convRate}%</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle title="Source Breakdown" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SOURCES.map(src => {
            const count = leads.filter(l => l.source === src).length;
            return (
              <View key={src} style={{ backgroundColor: COLORS.surface2, borderRadius: 8, padding: 12, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: COLORS.border }}>
                <Text style={{ color: COLORS.primary, fontSize: 22, fontWeight: '800' }}>{count}</Text>
                <Text style={{ color: COLORS.textDim, fontSize: 10, marginTop: 3, textAlign: 'center' }}>{src}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16 },
  statRow: { flexDirection: 'row' },
});

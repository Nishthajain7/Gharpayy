import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, STAGE_COLORS, hoursAgo, Lead, Agent } from '@/constants/theme';
import { StageBadge, SourceBadge, Avatar } from './UI';

interface Props {
  lead:    Lead;
  agent?:  Agent;
  onPress: () => void;
  compact?: boolean;
}

export default function LeadCard({ lead, agent, onPress, compact }: Props) {
  const inactive     = hoursAgo(lead.lastActivity);
  const needsFollowup = inactive >= 24 && lead.stage !== 'Booked' && lead.stage !== 'Lost';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[s.card, needsFollowup && s.cardAlert]}
    >
      <View style={[s.accentBar, { backgroundColor: STAGE_COLORS[lead.stage] ?? COLORS.primary }]} />

      <View style={{ flex: 1 }}>
        <View style={s.row}>
          <Text style={s.name} numberOfLines={1}>{lead.name}</Text>
          <StageBadge stage={lead.stage} small />
        </View>

        <View style={[s.row, { marginTop: 4 }]}>
          <Text style={s.phone}>+91 {lead.phone}</Text>
          <SourceBadge source={lead.source} />
        </View>

        {!compact && (lead.location || lead.budget) ? (
          <View style={[s.row, { marginTop: 6 }]}>
            {lead.location ? <Text style={s.meta}>📍 {lead.location}</Text> : null}
            {lead.budget   ? <Text style={s.meta}>₹{lead.budget.toLocaleString()}/mo</Text> : null}
          </View>
        ) : null}

        <View style={[s.row, { marginTop: 8 }]}>
          {agent ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Avatar initials={agent.avatar} size={20} />
              <Text style={s.agentName}>{agent.name.split(' ')[0]}</Text>
            </View>
          ) : null}
          <Text style={[s.inactive, needsFollowup && { color: COLORS.danger }]}>
            {needsFollowup ? '⚠ ' : ''}
            {inactive < 1 ? 'Just now' : inactive < 24 ? `${inactive}h ago` : `${Math.floor(inactive / 24)}d ago`}
          </Text>
        </View>

        {lead.firstResponseAt === null && lead.stage === 'New Lead' ? (
          <View style={s.slaBanner}>
            <Text style={s.slaText}>⏳ Awaiting first response · SLA: 5 min</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, marginBottom: 10,
    flexDirection: 'row', overflow: 'hidden',
    padding: 12,
    paddingLeft: 0,
    marginHorizontal: 20
  },
  cardAlert: { borderColor: COLORS.danger + '55', backgroundColor: COLORS.danger + '06' },
  accentBar: { width: 3, alignSelf: 'stretch', marginRight: 12 },
  row:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: COLORS.text, fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  phone:     { color: COLORS.textSub,  fontSize: 12, flex: 1 },
  meta:      { color: COLORS.textMuted, fontSize: 12, marginRight: 12 },
  agentName: { color: COLORS.textDim, fontSize: 11, marginLeft: 4 },
  inactive:  { color: COLORS.textDim, fontSize: 11 },
  slaBanner: {
    marginTop: 8, backgroundColor: COLORS.warning + '18',
    borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8,
  },
  slaText: { color: COLORS.warning, fontSize: 10, fontWeight: '600' },
});

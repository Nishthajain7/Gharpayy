import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import { COLORS, STAGES, STAGE_COLORS } from '@/constants/theme';
import LeadCard from '@/components/LeadCard';

export default function PipelineScreen() {
  const router = useRouter();
  const { state } = useAppStore();
  const { leads, agents } = state;

  const stages = STAGES.filter(s => s !== 'Lost');
  const [activeStage, setActiveStage] = useState(stages[0]);

  const stageLeads = leads.filter(l => l.stage === activeStage);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>

      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 }}>
        <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '800' }}>
          Pipeline
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          alignItems: 'center'
        }}
        style={{ marginBottom: 20, flexGrow:0 }}
      >
        {stages.map(stage => {
          const color = STAGE_COLORS[stage];
          const count = leads.filter(l => l.stage === stage).length;

          return (
            <TouchableOpacity
              key={stage}
              onPress={() => setActiveStage(stage)}
              style={[
                s.stageChip,
                activeStage === stage && { borderColor: color, backgroundColor: color + '20' }
              ]}
            >
              <Text
                style={[
                  s.stageText,
                  activeStage === stage && { color }
                ]}
              >
                {stage} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Leads */}
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {stageLeads.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ color: COLORS.textDim }}>No leads</Text>
          </View>
        ) : (
          stageLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              agent={agents.find(a => a.id === lead.agentId)}
              onPress={() =>
                router.push({ pathname: '/modal', params: { leadId: lead.id } })
              }
            />
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

    </View>
  );
}

const s = StyleSheet.create({
  stageChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface2,
    alignSelf: 'flex-start'
  },

  stageText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },

  empty: {
    backgroundColor: COLORS.surface2,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  }
});
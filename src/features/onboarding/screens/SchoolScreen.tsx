import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { TextInput } from '@/components/TextInput';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { SelectedSchool } from '@/types/school';

import { GradeSelector } from '../components/GradeSelector';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { SCHOOL_QUERY_MAX } from '../constants';
import { useOnboarding } from '../OnboardingProvider';
import { useSchoolSearch } from '../useSchoolSearch';

// Figma 회원가입 2/4 (node 1:260). Not ported: the 학생 구분 cards (중학생/고등학생/N수생·대학생/일반인),
// because profiles has no column for them (db-schema.md only stores school + grade 1~3).
export function SchoolScreen() {
  const router = useRouter();
  const { draft, update } = useOnboarding();
  const [query, setQuery] = useState('');
  const search = useSchoolSearch(query);

  const trimmed = query.trim();
  const canTypeManually = search.kind === 'empty' || search.kind === 'error';

  function select(school: SelectedSchool) {
    update({ school });
  }

  return (
    <OnboardingLayout
      step={2}
      title="어느 학교, 몇 학년인가요?"
      subtitle="AI 학생이 선생님 눈높이에 맞춰 질문해요."
      onBack={() => router.back()}
      cta={{
        label: '확인',
        disabled: !draft.school || !draft.grade,
        onPress: () => router.push('/(onboarding)/concern'),
      }}
    >
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>학년</Text>
        <GradeSelector value={draft.grade} onChange={(grade) => update({ grade })} />
      </View>

      <View style={styles.section}>
        <View>
          <Text style={styles.sectionLabel}>학교명</Text>
          <Text style={styles.hint}>내신 일정과 과목 연동에 쓰여요.</Text>
        </View>

        <TextInput
          placeholder="학교 이름으로 검색"
          value={query}
          onChangeText={setQuery}
          maxLength={SCHOOL_QUERY_MAX}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {draft.school ? (
          <View style={styles.selected} accessibilityLiveRegion="polite">
            <Text style={styles.selectedLabel}>선택한 학교</Text>
            <Text style={styles.selectedName}>
              {draft.school.school_name}
              {draft.school.school_code ? '' : ' (직접 입력)'}
            </Text>
          </View>
        ) : null}

        {search.kind === 'idle' ? (
          <Text style={styles.status}>학교 이름을 2자 이상 입력해 주세요.</Text>
        ) : null}
        {search.kind === 'loading' ? <ActivityIndicator color={colors.green[500]} /> : null}

        {search.kind === 'results' ? (
          <View style={styles.list}>
            {search.schools.map((school) => {
              const isSelected = draft.school?.school_code === school.school_code;
              return (
                <Pressable
                  key={school.school_code}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() =>
                    select({
                      school_name: school.school_name,
                      school_code: school.school_code,
                      school_kind: school.school_kind,
                      address: school.address,
                    })
                  }
                  style={[styles.row, isSelected && styles.rowSelected]}
                >
                  <Text style={styles.rowName}>{school.school_name}</Text>
                  {school.address ? <Text style={styles.rowAddress}>{school.address}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {canTypeManually ? (
          <View style={styles.manual}>
            <Text style={styles.status}>
              {search.kind === 'error'
                ? '학교를 검색하지 못했어요. 직접 입력할 수 있어요.'
                : '검색 결과가 없어요. 직접 입력할 수 있어요.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                select({ school_name: trimmed, school_code: null, school_kind: null })
              }
              style={styles.manualButton}
            >
              <Text style={styles.manualButtonText}>{`'${trimmed}' 직접 입력하기`}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing[12], marginBottom: spacing[24] },
  sectionLabel: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.text.primary },
  hint: { ...typography.caption, fontFamily: fontFamily.body.regular, color: colors.neutral[500] },
  status: { ...typography.caption, color: colors.text.tertiary },
  selected: {
    padding: spacing[12],
    borderRadius: radius.lg,
    backgroundColor: colors.bg.brandSubtle,
    gap: spacing[4],
  },
  selectedLabel: { ...typography.micro, color: colors.text.brand },
  selectedName: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.green[800] },
  list: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  rowSelected: { backgroundColor: colors.bg.brandSubtle },
  rowName: { ...typography.body2, fontFamily: fontFamily.body.regular, color: colors.neutral[800] },
  rowAddress: { ...typography.caption, fontFamily: fontFamily.body.regular, color: colors.text.tertiary },
  manual: { gap: spacing[8] },
  manualButton: {
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
  },
  manualButtonText: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.text.brand },
});

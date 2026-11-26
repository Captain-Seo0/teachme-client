import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { StudentType } from '@/types/profile';
import type { SelectedSchool } from '@/types/school';

import { GradeSelector } from '../components/GradeSelector';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { SchoolSearchBox } from '../components/SchoolSearchBox';
import { StudentTypeCard } from '../components/StudentTypeCard';
import { SCHOOL_QUERY_MAX, STUDENT_TYPE_OPTIONS } from '../constants';
import { useOnboarding } from '../OnboardingProvider';
import { useSchoolSearch } from '../useSchoolSearch';

const TYPE_GAP = 10;

// Figma 회원가입 2/4 (node 1:260). Student type is required; grade only for middle/high school students;
// school is required for them and optional (skippable) for repeat_exam_taker / general.
export function SchoolScreen() {
  const router = useRouter();
  const { draft, update } = useOnboarding();
  const [query, setQuery] = useState('');
  const search = useSchoolSearch(query);

  const typeOption = STUDENT_TYPE_OPTIONS.find((o) => o.value === draft.studentType);
  const hasGrade = typeOption?.hasGrade ?? false;
  const schoolOptional = !!typeOption && !typeOption.hasGrade;
  const trimmed = query.trim();

  // Middle school students only see 중학교, high school students only 고등학교 (filtered client-side).
  const kind = typeOption?.schoolKind ?? null;
  const schools =
    search.kind === 'results'
      ? search.schools.filter((s) => !kind || s.school_kind === kind)
      : [];
  const noResults = search.kind === 'empty' || (search.kind === 'results' && schools.length === 0);
  const canTypeManually = noResults || search.kind === 'error';

  function selectType(value: StudentType) {
    const next = STUDENT_TYPE_OPTIONS.find((o) => o.value === value);
    const nextKind = next?.schoolKind ?? null;
    const keepSchool =
      !draft.school || !draft.school.school_kind || !nextKind || draft.school.school_kind === nextKind;
    update({
      studentType: value,
      grade: next?.hasGrade ? draft.grade : null,
      school: keepSchool ? draft.school : null,
    });
  }

  function selectSchool(school: SelectedSchool) {
    update({ school });
  }

  const canContinue = !!typeOption && (!hasGrade || (!!draft.grade && !!draft.school));

  return (
    <OnboardingLayout
      step={2}
      title="어느 학교, 몇 학년인가요?"
      subtitle="AI 학생이 선생님 눈높이에 맞춰 질문해요."
      onBack={() => router.back()}
      cta={{
        label: '확인',
        disabled: !canContinue,
        onPress: () => router.push('/(onboarding)/concern'),
      }}
    >
      <View style={styles.types} accessibilityRole="radiogroup">
        {STUDENT_TYPE_OPTIONS.map((option) => (
          <StudentTypeCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={draft.studentType === option.value}
            onPress={() => selectType(option.value)}
          />
        ))}
      </View>

      {hasGrade ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>학년</Text>
          <GradeSelector value={draft.grade} onChange={(grade) => update({ grade })} />
        </View>
      ) : null}

      <View style={styles.section}>
        <View>
          <Text style={styles.sectionLabel}>학교명</Text>
          <Text style={styles.hint}>
            {schoolOptional
              ? '선택 사항이에요. 건너뛰어도 돼요.'
              : '내신 일정과 과목 연동에 쓰여요.'}
          </Text>
        </View>

        <SchoolSearchBox
          value={query}
          onChangeText={setQuery}
          maxLength={SCHOOL_QUERY_MAX}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {draft.school ? (
          <View style={styles.selected} accessibilityLiveRegion="polite">
            <View style={styles.selectedTexts}>
              <Text style={styles.selectedLabel}>선택한 학교</Text>
              <Text style={styles.selectedName}>
                {draft.school.school_name}
                {draft.school.school_code ? '' : ' (직접 입력)'}
              </Text>
            </View>
            {schoolOptional ? (
              <Pressable accessibilityRole="button" hitSlop={spacing[8]} onPress={() => update({ school: null })}>
                <Text style={styles.clearSelected}>선택 취소</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {search.kind === 'idle' ? (
          <Text style={styles.status}>학교 이름을 2자 이상 입력해 주세요.</Text>
        ) : null}
        {search.kind === 'loading' ? <ActivityIndicator color={colors.green[500]} /> : null}

        {schools.length > 0 ? (
          <View style={styles.list}>
            {schools.map((school) => {
              const isSelected = draft.school?.school_code === school.school_code;
              return (
                <Pressable
                  key={school.school_code}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() =>
                    selectSchool({
                      school_name: school.school_name,
                      school_code: school.school_code,
                      school_kind: school.school_kind,
                      address: school.address,
                    })
                  }
                  style={[styles.row, isSelected && styles.rowSelected]}
                >
                  <View style={styles.rowTexts}>
                    <Text style={styles.rowName}>{school.school_name}</Text>
                    {school.address ? <Text style={styles.rowAddress}>{school.address}</Text> : null}
                  </View>
                  {isSelected ? <View style={styles.check} /> : null}
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
              onPress={() => selectSchool({ school_name: trimmed, school_code: null, school_kind: null })}
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
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: TYPE_GAP },
  section: { gap: spacing[12], marginTop: spacing[16] },
  sectionLabel: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.text.primary },
  hint: { ...typography.caption, fontFamily: fontFamily.body.regular, color: colors.neutral[500] },
  status: { ...typography.caption, color: colors.text.tertiary },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[12],
    padding: spacing[12],
    borderRadius: radius.lg,
    backgroundColor: colors.bg.brandSubtle,
  },
  selectedTexts: { flex: 1, gap: spacing[4] },
  selectedLabel: { ...typography.micro, color: colors.text.brand },
  selectedName: { ...typography.body1, fontFamily: fontFamily.body.bold, color: colors.green[800] },
  clearSelected: { ...typography.caption, color: colors.text.secondary, textDecorationLine: 'underline' },
  list: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  rowSelected: { backgroundColor: colors.bg.brandSubtle },
  rowTexts: { flex: 1, gap: spacing[4] },
  rowName: { ...typography.body2, fontFamily: fontFamily.body.regular, color: colors.neutral[800] },
  rowAddress: { ...typography.caption, fontFamily: fontFamily.body.regular, color: colors.text.tertiary },
  // Check glyph drawn with borders (no SVG dependency): rotated L shape.
  check: {
    width: 6,
    height: 11,
    marginRight: spacing[4],
    marginBottom: 3,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.green[500],
    transform: [{ rotate: '45deg' }],
  },
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

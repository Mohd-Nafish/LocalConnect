import { ReactNode } from 'react';
import {
  RefreshControl,
  RefreshControlProps,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { colors, spacing } from '../theme';
import { ScreenHeader } from './ScreenHeader';

type ScreenLayoutProps = {
  title: string;
  children: ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

export function ScreenLayout({ title, children, refreshControl }: ScreenLayoutProps) {
  return (
    <View style={styles.container}>
      <ScreenHeader title={title} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
});

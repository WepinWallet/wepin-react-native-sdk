import * as React from 'react';
import { useContext } from 'react';
import { View, SafeAreaView } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { WebView } from './Webview';
import { StyleSheet } from 'react-native';
export const WepinWidget = ({ children, webviewConfig }) => {
    const safeAreaInsetsContext = useContext(SafeAreaInsetsContext);
    if (safeAreaInsetsContext === null) {
        return (<SafeAreaView>
        <View style={styles.content}>
          <React.Fragment>
            <WebView ref={WebView.instance} config={webviewConfig}/>
            {children}
          </React.Fragment>
        </View>
      </SafeAreaView>);
    }
    return (<View style={styles.content}>
      <React.Fragment>
        <WebView ref={WebView.instance} config={webviewConfig}/>
        {children}
      </React.Fragment>
    </View>);
};
const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
});
//# sourceMappingURL=WepinWidget.js.map
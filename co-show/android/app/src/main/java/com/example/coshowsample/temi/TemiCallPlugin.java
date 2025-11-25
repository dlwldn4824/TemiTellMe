package com.example.coshowsample.temi;

import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

// Temi SDK imports - SDK가 필요하면 sdk-debug.aar 파일을 libs 폴더에 추가하세요
// SDK가 없으면 이 파일은 컴파일되지 않을 수 있습니다
import com.robotemi.sdk.Robot;
import com.robotemi.sdk.UserInfo;

@CapacitorPlugin(name = "TemiCall")
public class TemiCallPlugin extends Plugin {

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private Robot robot;

    @Override
    public void load() {
        super.load();
        robot = Robot.getInstance();
    }

    @PluginMethod
    public void startTelepresence(PluginCall call) {
        String displayName = call.getString("displayName");
        String peerId = call.getString("peerId");

        if (TextUtils.isEmpty(displayName) || TextUtils.isEmpty(peerId)) {
            call.reject("displayName and peerId are required");
            return;
        }

        if (robot == null) {
            call.reject("Temi SDK is not ready on this device.");
            return;
        }

        mainHandler.post(() -> {
            try {
                robot.startTelepresence(displayName, peerId);
                JSObject result = new JSObject();
                result.put("ok", true);
                call.resolve(result);
            } catch (Exception ex) {
                call.reject("Failed to start telepresence: " + ex.getMessage(), ex);
            }
        });
    }

    @PluginMethod
    public void getContacts(PluginCall call) {
        if (robot == null) {
            call.reject("Temi SDK is not ready on this device.");
            return;
        }

        mainHandler.post(() -> {
            try {
                JSObject result = new JSObject();
                JSObject[] contacts = robot.getAllContact()
                        .stream()
                        .filter(info -> info != null)
                        .map(this::mapUserInfo)
                        .toArray(JSObject[]::new);
                result.put("contacts", contacts);
                call.resolve(result);
            } catch (Exception ex) {
                call.reject("Failed to fetch contacts: " + ex.getMessage(), ex);
            }
        });
    }

    private JSObject mapUserInfo(UserInfo info) {
        JSObject obj = new JSObject();
        obj.put("displayName", info.getName());
        obj.put("userId", info.getUserId()); // Peer ID
        obj.put("picUrl", info.getPicUrl());
        obj.put("role", info.getRole());
        return obj;
    }
}

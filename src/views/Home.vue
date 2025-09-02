<template>
  <div id="theme-toggle">
    <el-tooltip content="Toggle theme" placement="bottom">
      <el-button circle size="large" @click="toggleTheme">
        <el-icon>
          <component :is="ThemeIcon" />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
  <div id="nav">
    <el-form v-if="!loginState" :model="loginForm" :inline="true">
      <el-form-item label="Email address" size="medium">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">Login</el-button>
      </el-form-item>
    </el-form>
    <template v-else>
      <el-button type="default" @click="refreshDevices()">Refresh</el-button>
      <el-button type="default" @click="logout()">Logout</el-button>
    </template>
  </div>
  <div id="devices">
    <div v-for="device in devicesSorted" :key="device.id">
      <el-card class="device" :style="device.data.online === false ? 'filter: opacity(0.65) grayscale(1);' : ''">
        <el-tooltip effect="dark" :content="device.type" :offset="-20"
          :visible-arrow="false">
          <el-avatar :src="`/device_icons/${device.type}.png`" shape="square">
            <img src="/device_icons/default.png"/>
          </el-avatar>
        </el-tooltip>
        <span class="device-name">{{ device.name }}</span>
        <template v-if="device.type === 'scene'">
          <el-button type="primary" circle size="large"
            @click="triggerScene(device);"
          ><i class="material-icons-round">play_arrow</i></el-button>
        </template>
        <template v-else>
          <el-button
            :type="getState(device.data.state) ? 'success' : 'default'"
            circle
            size="large"
            :disabled="!device.data.online"
            @click="toggleDevice(device);"
          ><i class="material-icons-round">{{ device.data.online ? 'power_settings_new' : 'cloud_off' }}</i></el-button>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import tuya from '@/libs/tuya'

export default {
  name: 'Home',
  setup () {
    const homeAssistantClient = new tuya.HomeAssistantClient(
      JSON.parse(localStorage.getItem('session'))
    )

    const loginState = ref(false)
    const devices = ref([])

    const devicesSorted = computed(() => {
      const order = { true: 0, undefined: 1, false: 2 }
      return devices.value.slice().sort((d1, d2) =>
        order[d1.data.online] > order[d2.data.online] ? 1 : -1
      )
    })

    const loginForm = ref({ username: '', password: '' })

    const { isDark, toggleTheme } = useTheme()
    const ThemeIcon = computed(() => (isDark.value ? Sunny : Moon))

    onMounted(async () => {
      // TODO handle expired session
      loginState.value = !!homeAssistantClient.getSession()
      if (!loginState.value) {
        // Clear session-scoped data but preserve UI preferences like theme
        try {
          localStorage.removeItem('session')
          localStorage.removeItem('devices')
        } catch (e) {}
        devices.value = []
      } else {
        devices.value = JSON.parse(localStorage.getItem('devices')) || []
      }
    })

    const login = async () => {
      try {
        await homeAssistantClient.login(
          loginForm.value.username,
          loginForm.value.password
        )
        localStorage.setItem('session', JSON.stringify(homeAssistantClient.getSession()))
        loginState.value = true
        loginForm.value = { username: '', password: '' }
        refreshDevices()
      } catch (err) {
        ElMessage.error(`Oops, login error. (${err})`)
      }
    }

    const logout = () => {
      homeAssistantClient.dropSession()
      // Clear session-scoped data but preserve UI preferences like theme
      try {
        localStorage.removeItem('session')
        localStorage.removeItem('devices')
      } catch (e) {}
      loginState.value = false
      loginForm.value = { username: '', password: '' }
      devices.value = []
    }

    const refreshDevices = async () => {
      // TODO handle expired session
      try {
        const discoveryResponse = await homeAssistantClient.deviceDiscovery()
        const discoveryDevices = discoveryResponse.payload.devices || []
        devices.value = discoveryDevices
        localStorage.setItem('devices', JSON.stringify(discoveryDevices))
      } catch (err) {
        ElMessage.error(`Oops, device discovery error. (${err})`)
      }
    }

    const toggleDevice = async (device) => {
      // TODO handle expired session
      // TODO change icon to el-icon-loading
      try {
        const newState = !getState(device.data.state)
        await homeAssistantClient.deviceControl(device.id, 'turnOnOff', newState)
        device.data.state = newState
      } catch (err) {
        ElMessage.error(`Oops, device control error. (${err})`)
      }
    }

    const triggerScene = async (device) => {
      // TODO handle expired session
      // TODO change icon to el-icon-loading
      try {
        await homeAssistantClient.deviceControl(device.id, 'turnOnOff', true)
      } catch (err) {
        ElMessage.error(`Oops, device control error. (${err})`)
      }
    }

     const  getState = (state) => {
      if (state === false || state === null || state === undefined || state === 0) {
        return false;
      }
      if (typeof state === 'string' && state.toLowerCase() === 'false') {
        return false;
      }
      return Boolean(state);
    }

    return {
      loginState,
      devices,
      devicesSorted,
      loginForm,
      login,
      logout,
      refreshDevices,
      toggleDevice,
      triggerScene,
      getState,
      isDark,
      toggleTheme,
      Moon,
      Sunny,
      ThemeIcon
    }
  }
}
</script>

<style scoped>
#theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

#nav {
  margin: 0 auto;
  margin-top: 64px;
  margin-bottom: 64px;
}

.el-card.device {
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 16px;
}
.el-card.device :deep(.el-card__body) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-card.device :deep(.el-card__body :last-child) {
  margin-left: auto;
}

.el-button.el-button--large {
  padding: 9px;
  font-size: 20px;
  line-height: 0px;
}

.el-avatar {
  background: transparent;
  margin-right: 16px;
}
</style>

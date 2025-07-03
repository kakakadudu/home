<template>
  <div class="cascader f-c-c p40">
    <div class="cascader-inner f-c-s">
      <div class="cascader-left p20">
        <div class="region">
          <div class="region-box province">
            <el-checkbox
              v-model="checkedProvinceAll"
              :indeterminate="indeterminateProvince"
              @change="changeProvinceAll"
            >
              全选
            </el-checkbox>
            <div class="district-box">
              <div class="province-item" v-for="item in list" :key="item.code">
                <el-checkbox
                  v-model="item.checked"
                  :indeterminate="item.indeterminate"
                  @change="changeProvince(item)"
                />
                <span
                  :class="{ active: item.actived }"
                  @click="clickProvince(item)"
                >
                  {{ item.name }}
                </span>
              </div>
            </div>
          </div>
          <div class="region-box city" v-if="showCity">
            <el-checkbox
              v-model="checkedCityAll"
              :indeterminate="indeterminateCity"
              @change="changeCityAll"
            >
              全选
            </el-checkbox>
            <div class="district-box">
              <div class="city-item" v-for="item in cities" :key="item.code">
                <el-checkbox
                  v-model="item.checked"
                  :indeterminate="item.indeterminate"
                  @change="changeCity(item)"
                  v-if="!item.children"
                >
                  <span style="color: var(--color-text)">{{ item.name }}</span>
                </el-checkbox>
                <template v-else>
                  <el-checkbox
                    v-model="item.checked"
                    :indeterminate="item.indeterminate"
                    @change="changeCity(item)"
                  />
                  <span
                    :class="{ active: item.actived }"
                    @click="clickCity(item)"
                  >
                    {{ item.name }}
                  </span>
                </template>
              </div>
            </div>
          </div>
          <div class="region-box area" v-if="showArea">
            <el-checkbox
              v-model="checkedAreaAll"
              :indeterminate="indeterminateArea"
              @change="changeAreaAll"
            >
              全选
            </el-checkbox>
            <div class="district-box">
              <div class="area-item" v-for="item in areas" :key="item.code">
                <el-checkbox
                  v-model="item.checked"
                  :indeterminate="item.indeterminate"
                  @change="changeArea(item)"
                >
                  <span style="color: var(--color-text)">{{ item.name }}</span>
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="btns-box f-c-e mt20">
          <el-button @click="handleCancel" :disabled="!selecteds.length">
            清空
          </el-button>
          <el-button type="primary" @click="handleOk">确定</el-button>
        </div>
      </div>
      <div class="cascader-right p20" v-if="!!selecteds.length">
        <div class="selecteds">
          <div class="selected-item" v-for="item in selecteds" :key="item.code">
            <span>{{ item.fullName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Cascader">
import { ref } from "vue";
import { region } from "@/utils/chinaRegion";
import type { Province, City } from "@/types/Cascader";

const cities = ref<City[]>([]);
const areas = ref<City[]>([]);
const checkedProvinceAll = ref<boolean>(false);
const indeterminateProvince = ref<boolean>(false);
const checkedCityAll = ref<boolean>(false);
const indeterminateCity = ref<boolean>(false);
const checkedAreaAll = ref<boolean>(false);
const indeterminateArea = ref<boolean>(false);
const showCity = ref<boolean>(false);
const showArea = ref<boolean>(false);
const selecteds = ref<{ [key: string]: string }[]>([]);

const list = ref<Province[]>(region);

/**
 * @param arr 省份数组
 * @param current 选择的省市区
 * @param indeterminate 半选状态
 */
const returnChecked = (
  arr: Province[] | City[],
  current: Province | City | boolean,
  indeterminate?: boolean
) => {
  return arr.map((m: any) => {
    if (typeof current === "boolean") {
      m.checked = current;
    } else {
      if (m.fullCode.split("-").includes(current.code)) {
        m.checked = current.checked;
      }
    }
    if (typeof indeterminate === "boolean") {
      m.indeterminate = indeterminate;
    }
    if (m.children) {
      m.children = returnChecked(m.children, current, indeterminate) as City[];
    }
    return m;
  });
};
const returnActived = (arr: Province[] | City[], current: string[]) => {
  return arr.map((m: any) => {
    m.actived = !!current.includes(m.code);
    if (m.children) {
      m.children = returnActived(m.children, current) as City[];
    }
    return m;
  });
};

// 选择省份
// 全选
const changeProvinceAll = () => {
  list.value = returnChecked(
    list.value,
    checkedProvinceAll.value,
    false
  ) as Province[];
  setCityOrAreaCheckAll();
};
const changeProvince = (item: Province) => {
  if (!item.children) {
    return;
  }
  list.value = returnChecked(list.value, item) as Province[];

  setProvinceOrCityCheck(1, item);
  // 设置城市 / 区域全选，区域显示
  setCityOrAreaCheckAll();
};
// 点击省份
const clickProvince = (item: Province) => {
  if (!item.children) {
    return;
  }
  list.value = returnActived(list.value, item.fullCode.split("-"));
  showCity.value = true;
  cities.value = [...item.children];
  areas.value = [];
  // 重置城市 / 区域全选，区域显示
  setCityOrAreaCheckAll();
  showArea.value = false;
};

// 选择城市
// 全选
const changeCityAll = () => {
  const cur = list.value.find((f) => cities.value[0].parentCode === f.code);
  if (cur) {
    cur.checked = checkedCityAll.value;
    list.value = returnChecked(list.value, cur, false) as City[];
    setCityOrAreaCheckAll();
  }
};
const changeCity = (item: City) => {
  item.indeterminate = false;
  list.value = returnChecked(list.value, item) as City[];
  // 选择城市，当前城市下的所有区域跟随状态，上级省份需要判断状态
  setProvinceOrCityCheck(0, item);
  setCityOrAreaCheckAll();
};
// 点击城市
const clickCity = (item: City) => {
  if (!item.children) {
    return;
  }
  showArea.value = true;
  list.value = returnActived(list.value, item.fullCode.split("-"));
  areas.value = [...item.children];
  setCityOrAreaCheckAll();
};

// 选择区域
// 全选
const changeAreaAll = () => {
  let cur;
  for (let i = 0; i < list.value.length; i++) {
    const f = list.value[i];
    if (f.children) {
      cur = f.children.find((c) => areas.value[0].parentCode === c.code);
      if (cur) {
        break;
      }
    }
  }
  if (cur) {
    cur.checked = checkedAreaAll.value;
    cur.indeterminate = false;
    list.value = returnChecked(list.value, cur) as City[];
    // 区域全选，上级城市跟随状态，需要判断上级省份状态
    list.value.forEach((f) => {
      if (f.children) {
        if (cur.fullCode.split("-").includes(f.code)) {
          // 省份选中状态
          // 全选
          f.checked = checkedAreaAll.value;
          // 半选
          f.indeterminate =
            f.children.some((a) => a.indeterminate || a.checked) && !f.checked;
        }
      }
    });
    setCityOrAreaCheckAll();
  }
};
const changeArea = (item: City) => {
  list.value = returnChecked(list.value, item) as City[];
  setProvinceOrCityCheck(-1, item);
  setCityOrAreaCheckAll();
};

// 判断省|市选中 / 半选
/**
 * @param sort -1传入的参数作为集合， 1传入的参数作为过滤条件 0不循环子集
 * @param item 传入的参数 当前选择的省|市
 */
const setProvinceOrCityCheck = (sort: -1 | 1 | 0, item: Province | City) => {
  list.value.forEach((f) => {
    if (f.children) {
      f.children.forEach((c) => {
        let check = false;
        switch (sort) {
          case -1:
            check = item.fullCode.split("-").includes(c.code);
            break;
          case 1:
            check = f.fullCode.split("-").includes(item.code);
            break;
        }
        if (check) {
          if (c.children) {
            // 城市选中状态
            // 全选
            c.checked = c.children.every((a) => a.checked);
            // 半选
            c.indeterminate = c.children.some((a) => a.checked) && !c.checked;
          }
        }
      });
      // 省份选中状态
      // 全选
      f.checked = f.children.every((a) => a.checked);
      // 半选
      f.indeterminate =
        f.children.some((a) => a.indeterminate || a.checked) && !f.checked;
    }
  });
};

// 设置城市 / 区域全选
const setCityOrAreaCheckAll = () => {
  // 省份全选
  checkedProvinceAll.value = list.value.every((f) => f.checked);
  // 省份半选
  indeterminateProvince.value =
    list.value.some((f) => f.indeterminate || f.checked) &&
    !checkedProvinceAll.value;
  // 城市全选
  checkedCityAll.value = cities.value.every((f) => f.checked);
  // 城市半选
  indeterminateCity.value =
    cities.value.some((f) => f.indeterminate || f.checked) &&
    !checkedCityAll.value;
  // 区域全选
  checkedAreaAll.value = showArea.value
    ? areas.value.every((f) => f.checked)
    : false;
  // 区域半选
  indeterminateArea.value = showArea.value
    ? areas.value.some((f) => f.checked) && !checkedAreaAll.value
    : false;
};

const returnSelecteds = (list: Province[] | City[]) => {
  list.filter((f) => {
    if (f.checked || f.indeterminate) {
      if (f.checked) {
        selecteds.value.push({
          code: f.code,
          name: f.name,
          fullCode: f.fullCode,
          fullName: f.fullName,
        });
      }
      if (f.children && f.indeterminate) {
        // 子级半选
        returnSelecteds(f.children);
      }
    }
  });
};
const handleOk = () => {
  selecteds.value = [];
  returnSelecteds(list.value);
};
const handleCancel = () => {
  selecteds.value = [];
  list.value = returnChecked(list.value, false, false) as Province[];
  setCityOrAreaCheckAll();
};
</script>

<style scoped lang="scss">
.cascader {
  flex-direction: column;
}
.cascader-inner {
  width: fit-content;
  gap: 50px;
  flex-wrap: wrap;
}
.cascader-left,
.cascader-right {
  width: fit-content;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
.region {
  width: fit-content;
  display: flex;

  .region-box {
    padding-left: 20px;
    width: 240px;
    &:not(:last-child) {
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}
.district-box {
  height: 300px;
  overflow: auto;
}
.selecteds {
  height: 384px;
  overflow: auto;
}
.province-item,
.city-item,
.area-item,
.selected-item {
  display: flex;
  gap: 10px;
  span {
    cursor: pointer;
    line-height: 32px;
  }
}
.active {
  color: var(--el-color-primary);
}
</style>

const EVENT_INFO = [
    {
      eventType: "face_recognition",
      eventTypeName: "Phát hiện đối tượng",
      eventLevel: "Alert",
      eventLevelName: "Cảnh báo",
      eventTitleColor: "#BEAC13",
      eventBgColor: "#daa52070",
      description: "",
    },
    {
      eventType: "human_falling",
      eventTypeName: "Phát hiện người té ngã",
      eventLevel: "Emergency",
      eventLevelName: "Khẩn cấp",
      eventTitleColor: "#F2635E",
      eventBgColor: "#f2635e70",
    },
    {
      eventType: "human_in",
      eventTypeName: "Người vào",
      eventLevel: "Notification",
      eventLevelName: "Thông báo",
      eventTitleColor: "#5A8938",
      eventBgColor: "#2E572E",
    },
    {
      eventType: "human_out",
      eventTypeName: "Người ra",
      eventLevel: "Notification",
      eventLevelName: "Thông báo",
      eventTitleColor: "#5A8938",
      eventBgColor: "#2E572E",
    },
  ];
  export default {
    getInfoById: (id) => {
      return EVENT_INFO.find((el) => el.eventType === id);
    },
  };
  
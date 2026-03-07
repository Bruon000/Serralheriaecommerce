/** symbolColor: "current" herda do texto; "white" força branco (ex.: bolinha verde). symbolOnly: só o ícone interno (para botão flutuante verde). */
const PATH_BUBBLE =
  "M16.02 3C8.85 3 3.02 8.83 3.02 16c0 2.28.6 4.5 1.74 6.46L3 29l6.72-1.76A12.9 12.9 0 0 0 16.02 29c7.17 0 13-5.83 13-13S23.19 3 16.02 3zm0 23.6c-2.02 0-4-.54-5.72-1.56l-.41-.24-3.99 1.05 1.07-3.89-.27-.4a10.62 10.62 0 0 1-1.68-5.74c0-5.87 4.77-10.64 10.64-10.64S26.66 9.93 26.66 15.8 21.89 26.6 16.02 26.6z";
const PATH_SYMBOL =
  "M19.11 17.34c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.2-1.35-.82-.73-1.38-1.63-1.54-1.9-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47-.16-.01-.34-.01-.52-.01s-.48.07-.73.34c-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.53-.08 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z";

export default function WhatsAppIcon({
  size = 16,
  symbolColor = "current",
  symbolOnly = false,
}: {
  size?: number;
  symbolColor?: "current" | "white";
  symbolOnly?: boolean;
}) {
  const fill = symbolColor === "white" ? "#ffffff" : "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      {!symbolOnly && <path fill={fill} d={PATH_BUBBLE} />}
      <path fill={fill} d={PATH_SYMBOL} />
    </svg>
  );
}

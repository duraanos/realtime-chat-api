export const getPrivateRoomName = (
  firstId: string,
  secondId: string
): string => {
  const sortedIds = [firstId, secondId].sort();
  return `private-${sortedIds[0]}-${sortedIds[1]}`;
};

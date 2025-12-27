function cleanParams<T extends Record<string, any>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );
}
export default cleanParams;

import { Switch } from "@/components/ui/switch"

export function PublicDisplaySwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className={`text-sm ${checked ? "text-green-600" : "text-gray-400"}`}>
        {checked ? "展示" : "隐藏"}
      </span>
    </div>
  )
}

import { LoginBox } from './right/LoginBox'
import { SilbukBox } from './right/SilbukBox'
import { HotBox } from './right/HotBox'
import { AdBox } from './right/AdBox'
import { NewBox } from './right/NewBox'
import { DcMediaBox } from './right/DcMediaBox'
import { DcIssueBox } from './right/DcIssueBox'

export function RightSidebar({ rankings, media, dcissue }) {
  return (
    <aside className="grid gap-3">
      <LoginBox />
      <SilbukBox rankings={rankings?.silbuk} />
      <HotBox rankings={rankings?.hot} />
      <AdBox />
      <NewBox rankings={rankings?.new} />
      <DcMediaBox items={media ?? []} />
      <DcIssueBox items={dcissue ?? []} />
    </aside>
  )
}


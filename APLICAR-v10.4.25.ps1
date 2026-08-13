$ErrorActionPreference = 'Stop'
$main = Join-Path $PSScriptRoot 'src\main.jsx'
if (!(Test-Path $main)) { throw 'src\main.jsx nao encontrado.' }
$text = [IO.File]::ReadAllText($main,[Text.Encoding]::UTF8)
$text = $text.Replace("const APP_VERSION='10.4.24';","const APP_VERSION='10.4.25';")
$old = "const publishedCount=allAds.reduce((sum,x)=>sum+Object.values(x.ad.publications||{}).filter(v=>v.status==='published').length,0);"
$new = "const detailedPublishedCount=allAds.reduce((sum,x)=>sum+Object.values(x.ad.publications||{}).filter(v=>v.status==='published').length,0);`n const announcedWithoutDetailedPublication=active.filter(p=>p.status==='Anunciado'&&!(p.ads||migrateLegacyAds(p)).some(ad=>Object.values(normalizeAd(ad).publications||{}).some(v=>v.status==='published'))).length;`n const publishedCount=detailedPublishedCount+announcedWithoutDetailedPublication;"
if (!$text.Contains($old)) { throw 'Contador de publicacoes nao encontrado.' }
$text = $text.Replace($old,$new)
$oldButton = '<button type="button" className="photo-open-camera" onClick={openOpenCamera} disabled={busy}><Camera size={15}/> Abrir Open Camera</button>'
$newButton = '<button type="button" className="photo-open-camera" onClick={()=>document.getElementById(`bmcenter-camera-${workPhone.id}`)?.click()} disabled={busy}><Camera size={15}/> Tirar fotos</button><input id={`bmcenter-camera-${workPhone.id}`} hidden type="file" accept="image/*" capture="environment" onChange={e=>{addPhotos(e.target.files);e.target.value=''''}}/><button type="button" onClick={openOpenCamera} disabled={busy}><ExternalLink size={15}/> Open Camera</button>'
if (!$text.Contains($oldButton)) { throw 'Botao Open Camera nao encontrado.' }
$text = $text.Replace($oldButton,$newButton)
$oldIntent = "window.location.href='intent:#Intent;action=android.media.action.STILL_IMAGE_CAMERA;package=net.sourceforge.opencamera;end'"
$newIntent = "window.location.href='intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;component=net.sourceforge.opencamera/.MainActivity;package=net.sourceforge.opencamera;end'"
$text = $text.Replace($oldIntent,$newIntent)
[IO.File]::WriteAllText($main,$text,(New-Object Text.UTF8Encoding($false)))
Write-Host 'v10.4.25 aplicada com sucesso.'

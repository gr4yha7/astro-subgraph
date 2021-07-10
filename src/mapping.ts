import {
  TokenMetadataURIUpdated as TokenMetadataURIUpdatedEvent,
  TokenURIUpdated as TokenURIUpdatedEvent,
  Transfer as TransferEvent,
  Token as TokenContract
} from "../generated/Token/Token"
import {
  Token,
  User,
} from "../generated/schema"

export function handleTokenMetadataURIUpdated(
  event: TokenMetadataURIUpdatedEvent
): void {
  let token = Token.load(event.params._uri)
  token.metadataURI = event.params._uri
  token.save()
}

export function handleTokenURIUpdated(event: TokenURIUpdatedEvent): void {
  let token = Token.load(event.params._uri)
  token.contentURI = event.params._uri
  token.save()
}

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  if (!token) {
    token = new Token(event.params.tokenId.toString())
    token.creator = event.params.to.toHexString()
    token.tokenID = event.params.tokenId
    token.createdAtTimestamp = event.block.timestamp

    let tokenContract = TokenContract.bind(event.address)
    token.contentURI = tokenContract.tokenURI(event.params.tokenId)
    token.contentURI = tokenContract.tokenMetadataURI(event.params.tokenId)
    token.save()
  }
  token.owner = event.params.to.toHexString()
  token.save()

  let user = User.load(event.params.to.toString())
  if (!user) {
    user = new User(event.params.to.toString())
    user.save()
  }
}
